import { immerable } from "immer";

export default class CreateMaskDetailRequest {
    [immerable] = true;

    public maskName: string = '';
    public expressionInput: string = '';
    public expressionOutput: string = '';
    public piiField: string = '';
    public level: string = '';
    public createCheckedOut: boolean = true;
}