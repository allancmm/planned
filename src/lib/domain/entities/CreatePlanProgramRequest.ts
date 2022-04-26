import { immerable } from "immer";

export default class CreatePlanProgramRequest {
    [immerable] = true;

    public programDefinitionGUID: string = '';
    public planGUID: string = '';
    public createCheckedOut: boolean = true;
}