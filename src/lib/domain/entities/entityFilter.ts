import { immerable } from 'immer';

export default class EntityFilter {
    [immerable] = true;

    public companyGuid: string = '';
    public productGuid: string = '';
    public planGuid: string = '';
    public transactionGuid: string = '';
    public migrationSets: string = '';
}