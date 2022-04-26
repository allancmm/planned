import {immerable} from 'immer';

export default class PlanFundStatus {
    [immerable] = true;

    public planFundStatusGuid: string = '';
    public planFundGuid: string = '';
    public effectiveDate?: Date;
    public activeFromDate?: Date;
    public activeToDate?: Date;
    public expirationDate?: Date;
    public statusCode: string = '';
    public isNewPlanFundStatus: boolean = false;
    public changeToken: boolean = false;
}