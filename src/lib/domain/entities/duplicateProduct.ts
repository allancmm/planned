import { DuplicateEntity } from "./duplicateEntity";

export class DuplicateProduct extends DuplicateEntity {
    public description?: string = '';
    public newEffectiveDate?: Date;
    public newExpirationDate?: Date;
    public createCheckedOut: boolean = false;
    public copyAllRules: boolean = false;
}