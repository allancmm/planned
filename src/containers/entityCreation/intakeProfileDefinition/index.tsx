import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { CollapseContainer, useLoading } from 'equisoft-design-ui-elements';
import produce, {immerable} from 'immer';
import { InputText, Options } from "../../../components/general";
import {useTabActions} from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import { defaultEntitiesService, defaultEntityInformationService } from '../../../lib/context';
import CreateIntakeProfileDefinitionRequest from '../../../lib/domain/entities/createIntakeProfileDefinitionRequest';
import MapKeyValue from '../../../lib/domain/entities/mapKeyValue';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import { OverrideEnumType } from '../../general/components/overrideEnum';
import { validateRequiredFields } from "../util";
import FrameworkComponent from "../frameworkComponent";

class ErrorIntakeProfileDefinition {
    [immerable] = true;
    profileDefinitionName = '';
    typeCode = '';
}

interface IntakeProfileDefinitionCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const IntakeProfileDefinitionCreationWizard = ({
   entityInformationService,
   entityService,
}: IntakeProfileDefinitionCreationProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [request, setRequest] = useState<CreateIntakeProfileDefinitionRequest>(new CreateIntakeProfileDefinitionRequest());
    const [profileDefinitionTypes, setProfileDefinitionTypes] = useState<MapKeyValue[]>([]);

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [error, setError] = useState(new ErrorIntakeProfileDefinition());

    const [loading, load] = useLoading();

    const optionsTypeCode = useMemo(() =>
        [{label: profileDefinitionTypes.length > 0 ? 'Select Type Code' : ' No Type Code Available', value: ''},
         ...profileDefinitionTypes.map((t) => ({
        label: t.shortDescription,
        value: t.codeValue,
    }))], [profileDefinitionTypes]);

    const fetchData = async () => {
        setProfileDefinitionTypes(await load(entityService.getIntakeProfileDefinitionTypes)());
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides = {[
                    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code }
                ]}
                showGeneralComponent={false}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    const handleFieldChanged = (field: 'profileDefinitionName' | 'typeCode', value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );
        setError(produce(error, (draft => {
            draft[field] = '';
        })));
    }

    const validateForm = () => {
        const { isValid, newError} = validateRequiredFields(error, request);
        setShowMessageOverride(!isOverrideValid);
        setError(newError);
        return isValid && isOverrideValid;
    }
    const createIntakeProfileDefinition = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const intakeProfileDefinition = await entityService.createIntakeProfileDefinition(request);
            const entityInformation = await entityInformationService.getEntityInformation(
                intakeProfileDefinition.entityType,
                intakeProfileDefinition.getGuid(),
                'DATA',
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    });

    return (
        <FrameworkComponent
            title='Create Intake Profile Definition'
            loading={loading}
            onSubmit={createIntakeProfileDefinition}
            onCancel={closeRightbar}
        >
            <CollapseContainer title='General' defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        label="Profile Definition Name"
                        value={request.profileDefinitionName}
                        required
                        feedbackMsg={error.profileDefinitionName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('profileDefinitionName', e.target.value)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>

            <CollapseContainer title='Override' defaultOpened>
                <PanelSectionContainer>
                    {renderOverride()}
                </PanelSectionContainer>
            </CollapseContainer>


            <CollapseContainer title='Type Code' defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='custom-select'
                        label="Type Code"
                        value={request.typeCode}
                        options={optionsTypeCode}
                        required
                        feedbackMsg={error.typeCode}
                        onChange={(o : Options) => handleFieldChanged('typeCode', o.value)}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

IntakeProfileDefinitionCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default IntakeProfileDefinitionCreationWizard;
