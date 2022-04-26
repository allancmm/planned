import { immerable } from "immer";
import OverrideSelector from "./overrideSelector";

export default class CreateAgreementDefinitionRequest extends OverrideSelector{
    [immerable] = true;
    public agreementName: string = '';
    public agreementCategoryCode: string = '';
    public typeCode: string = '';
    public statusCode: string = '';
    public effectiveFrom: Date = new Date();
    public effectiveTo?: Date;
    public createCheckedOut: boolean = true;
}