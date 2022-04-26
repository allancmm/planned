import {immerable} from 'immer';

export default class CreateSystemDateRequest {
    [immerable] = true;
    public year: string = ''
    public calendarCode: string = ''
    public override: boolean = false
}