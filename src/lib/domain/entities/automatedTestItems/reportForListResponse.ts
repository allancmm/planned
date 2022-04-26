import {immerable} from 'immer';

export class ReportForListResponse {
    [immerable] = true;

    public label: string = '';
    public folderName: string = '';
}