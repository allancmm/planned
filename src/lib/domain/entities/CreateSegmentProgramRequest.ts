import { immerable } from "immer";

export default class CreateSegmentProgramRequest {
    [immerable] = true;

    public programDefinitionGUID: string = '';
    public segmentGuid: string = '';
    public createCheckedOut: boolean = true;
}