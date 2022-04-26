import {immerable} from 'immer';

export default class CreateWorkflowTaskDefinitionRequest {
    [immerable] = true;
    workflowTaskName: string = '';
    workflowQueueCode: string = '';
    creationMethod: string = '';
    entityCode: string = '';
    description?: string = '';
    createCheckedOut?: boolean = true;
}
