import {immerable} from 'immer';
export default class SystemDate {
    [immerable] = true;
    public id: string = '';
    public systemDateGuid: string = '';
    public systemDate: string = '';
    public businessDayIndicator: string = '';
    public currentIndicator: string = '';
    public monthEndIndicator: string = '';
    public quarterEndIndicator: string = '';
    public yearEndIndicator: string = '';
    public nextSystemDate: string = '';
    public previousSystemDate: string = '';
    public calendarCode: string = '';
}

