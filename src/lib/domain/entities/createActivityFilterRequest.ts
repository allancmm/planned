import { immerable } from "immer";
import { EntityLevel } from "../enums/entityLevel";
import OverrideSelector from "./overrideSelector";

export default class CreateActivityFilterRequest extends OverrideSelector {
    [immerable] = true;
    public filterName: string = '';
    public typeCode: string = '';
    public xmlData: string = '';
    public createCheckedOut: boolean = true;
    public securityGroupGuid?: string = '';
    public level: EntityLevel = '';
    public clientGuid: string = '';
}
