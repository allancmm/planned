import React, {FormEvent, useContext, useState, useEffect, ChangeEvent, useMemo} from "react";
import {CollapseContainer, useLoading} from "equisoft-design-ui-elements";
import produce, {immerable} from "immer";
import { InputText, Options } from "../../../components/general";
import { useTabActions } from "../../../components/editor/tabs/tabContext";
import { OPEN } from "../../../components/editor/tabs/tabReducerTypes";
import { RightbarContext } from "../../../components/general/sidebar/rightbarContext";
import { PanelSectionContainer } from "../../../components/general/sidebar/style";
import { defaultEntitiesService, defaultEntityInformationService } from "../../../lib/context";
import CreateExposedComputationRequest from "../../../lib/domain/entities/createExposedComputationRequest";
import EntityService from "../../../lib/services/entitiesService";
import EntityInformationService from "../../../lib/services/entityInformationService";
import {getEnumKey, OverrideEnumType} from '../../general/components/overrideEnum';
import { validateRequiredFields } from "../util";
import FrameworkComponent from "../frameworkComponent";

class ErrorValidationExpComp {
    [immerable] = true;
    computationID = '';
    ruleName = '';
}

interface ExposedComputationCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const ExposedComputationCreationWizard = ({ entityService, entityInformationService }: ExposedComputationCreationProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const [request, setRequest] = useState<CreateExposedComputationRequest>(new CreateExposedComputationRequest());
    const [ruleNames, setRuleNames] = useState<string[]>([]);
    const [errorValidation, setErrorValidation] = useState(new ErrorValidationExpComp());

    const dispatch = useTabActions();
    const [loading, load] = useLoading();

    const optionsRuleName = useMemo(() =>
        [{ label: ruleNames.length > 0 ? 'Select Rule Name' : ' No Rule Name Available', value: ''},
           ...ruleNames.map((c) => ({ label: c, value: c }))], [ruleNames]);

    const fetchData = async () => {
        request.overrideLevel = getEnumKey(OverrideEnumType.GLOBAL.code);
        request.overrideGuid = '';
        setRuleNames(await load(entityService.getBusinessRules)('08'));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const validateForm = () => {
        const { isValid, newError} = validateRequiredFields(errorValidation, request);
        setErrorValidation(newError);
        return isValid;
    }

    const createExposedComputation = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const exposedComputation = await entityService.createExposedComputation(request);
            const entityInformation = await entityInformationService.getEntityInformation(
                exposedComputation.entityType,
                exposedComputation.getGuid(),
                'DATA',
            );

            entityInformation.oipaRule.ruleName = request.computationID;
            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    });

    const handleFieldChanged = (field: 'computationID' | 'ruleName', value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );

        setErrorValidation(produce(errorValidation, (draft => {
            draft[field] = '';
        })));
    }

    return (
        <FrameworkComponent
            title='Create Exposed Computation'
            loading={loading}
            onSubmit={createExposedComputation}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        value={request.computationID}
                        label="Computation ID"
                        required
                        feedbackMsg={errorValidation.computationID}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('computationID', e.target.value)}
                    />

                    <InputText
                        type='custom-select'
                        label="Rule Name"
                        value={request.ruleName}
                        options={optionsRuleName}
                        onChange={(o : Options) => handleFieldChanged('ruleName', o.value)}
                        required
                        feedbackMsg={errorValidation.ruleName}
                    />
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );

};

ExposedComputationCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};
export default ExposedComputationCreationWizard;