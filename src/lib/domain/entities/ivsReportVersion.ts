import { immerable } from 'immer';
import IvsReportVersionHistory from './ivsReportVersionHistory';

export default class IvsReportVersion {
    [immerable] = true;

    public versionNumber: string = '';
    public versionHistory: IvsReportVersionHistory[] = [];
}
