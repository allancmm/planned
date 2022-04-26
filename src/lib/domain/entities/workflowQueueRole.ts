import {Expose} from 'class-transformer';
import {immerable} from 'immer';
import {v4 as uuid} from 'uuid';

export default class WorkflowQueueRole {
    [immerable] = true;

    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public workflowQueueCode: string = '';
    public workflowRoleCode: string = '';
    public changeToken: boolean = false;

    constructor() {
        this.rowID = uuid();
    }
}