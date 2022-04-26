import { DuplicateEntity } from "./duplicateEntity";

export class DuplicatePlan extends DuplicateEntity {
    public newEffectiveDate?: Date;
    public newExpirationDate?: Date;
    public createCheckedOut: boolean = false;
    public copyAllRules: boolean = false;
}