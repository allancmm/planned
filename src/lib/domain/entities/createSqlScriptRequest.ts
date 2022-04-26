import { immerable } from "immer";

export default class CreateSqlScriptRequest {
    [immerable] = true;
    public scriptName: string = '';
    public createCheckedOut: boolean = true;
}