import { immerable } from 'immer';

export default class ValidateVersionResponse {
    [immerable] = true;
    public sameVersion: boolean = false;
    public supported: boolean = false;
    public errorMessage: string = "";
}