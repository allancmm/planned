import {immerable} from 'immer';
import { v4 as uuid } from 'uuid';
export default class PlanStateApproval {
    [immerable] = true;

    public rowId: string = uuid();
    public stateApprovalGuid: string = '';
    public stateCode: string = '';
    public planGuid: string = '';
    public effectiveDate?: Date;
    public expirationDate?: Date;
    public isNew: boolean = false;
    public changeToken: boolean = false;
}