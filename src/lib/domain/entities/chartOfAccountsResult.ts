import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';
import { Expose } from 'class-transformer';

export default class ChartOfAccountsResult {
    [immerable] = true;

    @Expose({ groups: ['cache'] })
    public rowID: string = '';
    public resultName: string = '';
    public insert: string = '';
    public chartOfAccountsEntryGuid: string = '';

    constructor() {
        this.rowID = uuid();
    }
}