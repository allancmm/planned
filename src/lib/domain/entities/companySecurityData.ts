import { EntityType } from "../enums/entityType";
import { immerable } from "immer";

export default class CompanySecurityData {
    [immerable] = true

    public entityGuid: string;
    public entityType: EntityType;
    public securityGroupGuid: string;
    public securityDetail: any;
    constructor(entityGuid: string, entityType: EntityType, securityGroupGuid: string, securityDetail: any){
        this.entityGuid = entityGuid;
        this.entityType = entityType;
        this.securityGroupGuid = securityGroupGuid;
        this.securityDetail = securityDetail;
    }

}