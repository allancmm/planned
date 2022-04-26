import { immerable } from "immer";
import OverrideSelector from './overrideSelector';

export default class CreateProductRequest extends OverrideSelector{
    [immerable] = true;

    public productName: string = '';
    public description?: string;
    public effectiveDate?: Date;
    public expirationDate?: Date;
    public createCheckedOut: boolean = true;
}