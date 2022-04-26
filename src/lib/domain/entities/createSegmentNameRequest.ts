import { immerable } from "immer";
import OverrideSelector from "./overrideSelector";

export default class CreateSegmentNameRequest extends OverrideSelector{
    [immerable] = true;
    public name: string = '';
    public createCheckedOut: boolean = true;
    public typeCode: string = '';
    public templateName?: string;
    public generalInfos = new OverrideSelector();
}