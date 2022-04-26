import { DuplicateEntity } from "./duplicateEntity";

export class DuplicateBusinessRules extends DuplicateEntity {
    public createCheckedOut: boolean = false;
    public stateCode?: string;
    public systemCode?: string;
}