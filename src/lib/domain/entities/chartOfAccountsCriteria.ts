import { Expose } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';

export default class ChartOfAccountsCriteria {
    [immerable] = true;

    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public criteriaName: string = '';
    public criteriaValue: string = '';
    public chartOfAccountsEntryGuid: string = '';
    constructor() {
        this.rowID = uuid();
    }
}