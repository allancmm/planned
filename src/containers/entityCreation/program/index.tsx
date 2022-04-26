import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import {immerable, produce} from 'immer';
import { InputText, Options } from "../../../components/general";
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {
    defaultEntitiesService,
    defaultEntityInformationService
} from '../../../lib/context';
import CreateProgramRequest from '../../../lib/domain/entities/createProgramRequest';
import MapKeyValue from '../../../lib/domain/entities/mapKeyValue';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import GeneralComponent from '../../general/components/generalComponent';
import { OverrideEnumType } from '../../general/components/overrideEnum';
import {validateRequiredFields} from "../util";
import FrameworkComponent from "../frameworkComponent";

class ErrorProgram {
    [immerable] = true;
    programName = '';
    typeCode = '';
}
interface ProgramDefinitionProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const ProgramDefinitionCreationWizard = ({
    entityService,
    entityInformationService,
}: ProgramDefinitionProps) => {
    const TYPE_CODE = "AsCodeProgramType"

    const dispatch = useTabActions();
    const { closeRightbar } = useContext(RightbarContext);

    const [request, setRequest] = useState<CreateProgramRequest>(new CreateProgramRequest());
    const [codeTypes, setCodeTypes] = useState<MapKeyValue[]>([]);

    const [showMessageOverride, setShowMessageOverride] = useState(false);
    const [isOverrideValid, setIsOverrideValid] = useState(false);
    const [error, setError] = useState(new ErrorProgram());

    const [loading, load] = useLoading();

    const optionsTypeCode = useMemo(() =>
        [{ label: codeTypes.length > 0 ? 'Select Type Code' : ' No Type Code Available', value: ''},
         ...codeTypes.map((code) => ({
        label: code.shortDescription,
        value: code.codeValue,
    }))], [codeTypes]);

    const fetchData = async () => {
        setCodeTypes(await load(entityService.getQuoteCodes)(TYPE_CODE));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const renderOverride = () => {
        return (
            <GeneralComponent
                data={request}
                filteredOverrides={[
                    { name: OverrideEnumType.PCOMPANY.value, value: OverrideEnumType.PCOMPANY.code }
                ]}
                load={load}
                setIsOverrideValid={setIsOverrideValid}
                showMessageOverride={showMessageOverride}
                setGeneralComponentState={() => setShowMessageOverride(false)}
            />
        );
    };

    const handleFieldChanged = (field: 'programName' | 'typeCode', value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );

        setError(produce(error, (draft => {
            draft[field] = '';
        })))
    }

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setShowMessageOverride(!isOverrideValid);
        setError(newError);
        return isValid && isOverrideValid;
    }

    const createProgramDefinition = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const program = await entityService.createProgram(request);
            const entityInformation = await entityInformationService.getEntityInformation(
                program.entityType,
                program.getGuid(),
                'XML_DATA',
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    });

    return (
        <FrameworkComponent
            title='Create Program'
            loading={loading}
            onSubmit={createProgramDefinition}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        value={request.programName}
                        label="Program Name"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('programName', e.target.value)}
                        required
                        feedbackMsg={error.programName}
                    />

                    <InputText
                        type='custom-select'
                        value={request.typeCode}
                        label="Type Code"
                        options={optionsTypeCode}
                        onChange={(o: Options) => handleFieldChanged('typeCode', o.value)}
                        required
                        feedbackMsg={error.typeCode}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    {renderOverride()}
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

ProgramDefinitionCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService
};

export default ProgramDefinitionCreationWizard;