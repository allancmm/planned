import { immerable } from "immer";
import OverrideSelector from "./overrideSelector";

export default class CreatePlanRequest extends OverrideSelector {
    [immerable] = true;
    public planName: string = '';
    public currencyCode?: string;
    public marketMakerGUID?: string;
    public effectiveDate?: Date;    
    public expirationDate?: Date;    
    public pointInTimeValuation?: string;    
    public mixedValuation?: string;    
    public planAllocationMethod: string = '';    
    public systemCode?: string;
    public createCheckedOut: boolean = true;    
}