import { immerable } from 'immer';
import IvsReportVersion from './ivsReportVersion';

export default class IvsVersionHistory {
    [immerable] = true;

    public ruleGuid: string = '';
    public ruleTypeCode: string = '';
    public ruleName: string = '';
    public version: IvsReportVersion[] = [];
}
