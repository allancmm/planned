import { immerable } from 'immer';

export default class IvsReportVersionHistory {
    [immerable] = true;

    public actionTypeCode: string = '';
    public environment: string = '';
    public datetime: string = '';
}
