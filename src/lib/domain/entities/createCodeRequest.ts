import { immerable } from 'immer';
export default class CreateCodeRequest {
    [immerable] = true;
    public name: string = '';
    public createCheckedOut: boolean = true;
}