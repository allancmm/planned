import { immerable } from "immer";
import OverrideSelector from "./overrideSelector";

export default class CreateQuoteDefinitionRequest extends OverrideSelector{
    [immerable] = true;
    public quoteName: string = '';
    public typeCode: string = '';
    public statusCode: string = '';
    public effectiveFrom: Date = new Date();
    public effectiveTo?: Date;
    public templateName?: string;
    public createCheckedOut: boolean = true;
}