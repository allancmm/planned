import { immerable } from 'immer';

export default class CreateChartAccountEntityRequest {
    [immerable] = true;

    public chartOfAccountsGuid: string = '';
    public chartOfAccountsEntityCode: string = '';
    public transactionName: string = '';
    public createCheckedOut: boolean = true;
}