import React, {FormEvent, useContext, useEffect, useMemo, useState} from "react";
import { CollapseContainer, useLoading } from "equisoft-design-ui-elements";
import { InputText, Options } from "../../../components/general";
import produce, {immerable} from "immer";
import { useTabActions } from "../../../components/editor/tabs/tabContext";
import { OPEN } from "../../../components/editor/tabs/tabReducerTypes";
import { RightbarContext } from "../../../components/general/sidebar/rightbarContext";
import { PanelSectionContainer } from "../../../components/general/sidebar/style";
import { defaultEntitiesService, defaultEntityInformationService } from "../../../lib/context";
import CreatePlanProgramRequest from "../../../lib/domain/entities/CreatePlanProgramRequest";
import Plan from "../../../lib/domain/entities/plan";
import ProgramDefinition from "../../../lib/domain/entities/programDefinition";
import EntityService from "../../../lib/services/entitiesService";
import EntityInformationService from "../../../lib/services/entityInformationService";
import {validateRequiredFields} from "../util";
import FrameworkComponent from "../frameworkComponent";

class ErrorProgramDefinition {
   [immerable] = true;
    planGUID = '';
    programDefinitionGUID = '';
}
interface PlanProgramDefinitionProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const PlanProgramDefinitionCreationWizard = ({ entityService, entityInformationService }: PlanProgramDefinitionProps) => {
    const { closeRightbar } = useContext(RightbarContext);
    const [request, setRequest] = useState<CreatePlanProgramRequest>(new CreatePlanProgramRequest());
    const [plansList, setPlansList] = useState<Plan[]>([]);
    const [definitionsList, setDefinitionsList] = useState<ProgramDefinition[]>([]);
    const dispatch = useTabActions();
    const [showError, setShowError] = useState<boolean>();
    const [error, setError] = useState(new ErrorProgramDefinition());

    const [loading, load] = useLoading();

    const optionsPlanName = useMemo(() => [
        { label: plansList.length > 0 ? 'Select One' : ' No Plan Available', value: ''},
        ...plansList.map((t) => ({
            label: t.planName,
            value: t.planGuid,
        }))
    ], [plansList]);

    const optionsProgramDefinition = useMemo(() => [
        { label: definitionsList.length > 0 ? 'Select One' : ' No Program Definition Available', value: ''},
        ...definitionsList.map((t) => ({
            label: t.programDefinitionName,
            value: t.programDefinitionGuid,
        }))
    ], [definitionsList]);

    const fetchData = load(async () => {
        const plans = await entityService.getAllPlans();
        setPlansList(plans);

        const definition = await entityService.getAllProgramDefinition();
        setDefinitionsList(definition);
    });

    useEffect(() => {
        fetchData();
    }, []);

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setError(newError);
        return isValid;
    }

    const createPlanProgramDefinition = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const exist = await entityService.planProgramExist(request);
            if (!exist) {
                const planProgram = await entityService.createPlanProgramDefinition(request);

                const entityInformation = await entityInformationService.getEntityInformation(
                    planProgram.entityType,
                    planProgram.getGuid(),
                    'XML_DATA',
                );
                dispatch({ type: OPEN, payload: { data: entityInformation } });
                closeRightbar();
            } else {
                setShowError(true);
            }
        }
    });

    const handleFieldChanged = (field: 'planGUID' | 'programDefinitionGUID', value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );
        setShowError(false);
        setError(produce(error, (draft) => {
            draft[field] = '';
        }));
    }

    return (
        <FrameworkComponent
            title='Create Plan Program Definition'
            loading={loading}
            onSubmit={createPlanProgramDefinition}
            onCancel={closeRightbar}
        >
            <CollapseContainer title={'General'} defaultOpened>
                <PanelSectionContainer>
                    <InputText
                        type='custom-select'
                        value={request.planGUID}
                        label="Plan name"
                        options={optionsPlanName}
                        onChange={(o: Options) => handleFieldChanged('planGUID', o.value)}
                        required
                        feedbackMsg={error.planGUID}
                    />

                    <InputText
                        type='custom-select'
                        value={request.programDefinitionGUID}
                        label="Program Definition Name"
                        options={optionsProgramDefinition}
                        onChange={(o: Options) => handleFieldChanged('programDefinitionGUID', o.value)}
                        required
                        feedbackMsg={error.programDefinitionGUID}
                    />
                    <span style={{ color: 'red' }}>
                        {showError ? 'Error : Plan program definition exist' : ''}
                     </span>
                </PanelSectionContainer>
            </CollapseContainer>
        </FrameworkComponent>
    );
};

PlanProgramDefinitionCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService
};

export default PlanProgramDefinitionCreationWizard;