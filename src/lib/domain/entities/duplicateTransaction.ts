import { DuplicateEntity } from "./duplicateEntity";

export class DuplicateTransaction extends DuplicateEntity {
    public createCheckedOut: boolean = false;
}