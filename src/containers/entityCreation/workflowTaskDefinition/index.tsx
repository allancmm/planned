import React, {ChangeEvent, FormEvent, useContext, useEffect, useMemo, useState} from 'react';
import { CollapseContainer, useLoading} from 'equisoft-design-ui-elements';
import {immerable, produce} from 'immer';
import { InputText, Options } from "../../../components/general";
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import {OPEN} from '../../../components/editor/tabs/tabReducerTypes';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import { PanelSectionContainer } from '../../../components/general/sidebar/style';
import {defaultEntitiesService, defaultEntityInformationService} from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import CreateWorkflowTaskDefinitionRequest from '../../../lib/domain/entities/createWorkflowTaskDefinitionRequest';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import {validateRequiredFields} from "../util";
import FrameworkComponent from "../frameworkComponent";

const WORKFLOW_QUEUE_CODE = "AsCodeWorkflowQueue";
const WORKFLOW_CREATION_METHOD = "AsCodeWorkflowCreationMethod";
const ENTITY_CODE = "AsCodeEntity";

type TypeFieldsWorkflow = 'workflowTaskName' | 'workflowQueueCode' | 'creationMethod' | 'entityCode' | 'description';

class ErrorWorkflow {
    [immerable] = true;
    workflowTaskName = '';
    workflowQueueCode = '';
    creationMethod = '';
    entityCode = '';
    description = '';
}
interface WorkflowTaskDefinitionCreationProps {
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const WorkflowTaskDefinitionCreationWizard = ({
    entityService,
    entityInformationService,
}: WorkflowTaskDefinitionCreationProps) => {
    const [request, setRequest] = useState<CreateWorkflowTaskDefinitionRequest>(new CreateWorkflowTaskDefinitionRequest());
    const dispatch = useTabActions();
    const { closeRightbar } = useContext(RightbarContext);
    const [loading, load] = useLoading();

    const [queueCodes, setQueueCodes] = useState<BasicEntity[]>([]);
    const [creationMethods, setCreationMethods] = useState<BasicEntity[]>([]);
    const [entityCodes, setEntityCodes] = useState<BasicEntity[]>([]);
    const [error, setError] = useState(new ErrorWorkflow());

    const optionsWorkflowCode = useMemo(() => [
        { label: queueCodes.length > 0 ? 'Select Workflow Queue Code' : ' No Workflow Queue Code Available', value: ''},
        ...Object.values(queueCodes).map((f) => ({
            label: f.name,
            value: f.value,
        }))
    ], [queueCodes]);

    const optionsCreateMethod = useMemo(() => [
        { label: creationMethods.length > 0 ? 'Select Creation Method' : ' No Creation Method Available', value: ''},
        ...Object.values(creationMethods).map((f) => ({
            label: f.name,
            value: f.value,
        }))
    ], [creationMethods]);

    const optionsEntityCode = useMemo(() => [
        { label: creationMethods.length > 0 ? 'Select Entity Code' : ' No Entity Code Available', value: ''},
        ...Object.values(entityCodes).map((f) => ({
            label: f.name,
            value: f.value,
        }))
    ], [entityCodes]);

    const fetchData = load(async () => {
        const [queueResp, creationResp, entityResp] = await Promise.allSettled([
            entityService.getCodes(WORKFLOW_QUEUE_CODE),
            entityService.getCodes(WORKFLOW_CREATION_METHOD),
            entityService.getCodes(ENTITY_CODE)
        ]);
        setQueueCodes( queueResp.status === 'fulfilled' ? queueResp.value : []);
        setCreationMethods(creationResp.status === 'fulfilled' ? creationResp.value : []);
        setEntityCodes(entityResp.status === 'fulfilled' ? entityResp.value : []);
    });

    useEffect(() => {
        fetchData();
    }, []);

    const validateForm = () => {
        const { isValid, newError } = validateRequiredFields(error, request);
        setError(newError);
        return isValid;
    }

    const createWorkflowTaskDefinition = load(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(validateForm()) {
            const workflowTaskDefinition = await entityService.createWorkflowTaskDefinition(request);

            const entityInformation = await entityInformationService.getEntityInformation(
                workflowTaskDefinition.entityType,
                workflowTaskDefinition.getGuid(),
                'DATA',
            );

            dispatch({ type: OPEN, payload: { data: entityInformation } });
            closeRightbar();
        }
    });


    const handleFieldChanged = async (field: TypeFieldsWorkflow,value: string) => {
        setRequest(
            produce(request, (draft) => {
                draft[field] = value;
            }),
        );
        setError(produce(error, (draft => {
            draft[field] = '';
        })));
    };

    return (
        <FrameworkComponent
            title='Create Workflow Task Definition'
            loading={loading}
            onSubmit={createWorkflowTaskDefinition}
            onCancel={closeRightbar}
        >
            <form id="CreateWorkflowTaskDefinitionForm" onSubmit={createWorkflowTaskDefinition}>
                <CollapseContainer title="General" defaultOpened>
                    <PanelSectionContainer>
                        <InputText
                            type='text'
                            value={request.workflowTaskName}
                            label="Workflow Task Name"
                            required
                            feedbackMsg={error.workflowTaskName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('workflowTaskName', e.target.value)}
                        />

                        <InputText
                            type='custom-select'
                            value={request.workflowQueueCode}
                            label="Workflow Queue Code"
                            options={optionsWorkflowCode}
                            required
                            feedbackMsg={error.workflowQueueCode}
                            onChange={(o : Options) => handleFieldChanged('workflowQueueCode', o.value)}
                        />

                        <InputText
                            type='custom-select'
                            value={request.creationMethod}
                            label="Creation Method"
                            options={optionsCreateMethod}
                            required
                            feedbackMsg={error.creationMethod}
                            onChange={(o : Options) => handleFieldChanged('creationMethod', o.value)}
                        />

                        <InputText
                            type='custom-select'
                            value={request.entityCode}
                            label="Entity Code"
                            options={optionsEntityCode}
                            required
                            feedbackMsg={error.entityCode}
                            onChange={(o : Options) => handleFieldChanged('entityCode', o.value)}
                        />

                        <InputText
                            type='text'
                            value={request.description}
                            label="Description"
                            feedbackMsg={error.description}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChanged('description', e.target.value)}
                        />
                    </PanelSectionContainer>
                </CollapseContainer>

            </form>
        </FrameworkComponent>
    );
};

WorkflowTaskDefinitionCreationWizard.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};

export default WorkflowTaskDefinitionCreationWizard;