import {immerable} from 'immer';

export default class CreateFileOutputRequest {
    [immerable] = true;

    public name: string = '';
    public createCheckedOut: boolean = true;
}