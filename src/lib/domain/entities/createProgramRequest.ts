import { immerable } from "immer";
import OverrideSelector from "./overrideSelector";

export default class CreateProgramRequest extends OverrideSelector {
    [immerable] = true;

    public programName: string = '';
    public typeCode: string = '';
    public createCheckedOut: boolean = true;
}