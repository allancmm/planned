import { immerable } from 'immer';
import { EntityType } from '../enums/entityType';
import Access, { YesNoType } from "../enums/yesNo";

export default class AuthCompanyWebServiceData {
    [immerable] = true
    public entityGuid: string;
    public entityType: EntityType ;
    public securityGroupGuid: string;
    public grantAccessAll: YesNoType = Access.No;
    public authCompanyWebServiceDetail: Record<string, string>;

    constructor(entityGuid: string,
                entityType: EntityType,
                securityGroupGuid: string,
                authCompanyWebServiceDetail: Record<string, string>,
                grantAccessAll?: YesNoType) {
        this.entityGuid = entityGuid;
        this.entityType = entityType;
        this.securityGroupGuid = securityGroupGuid;
        this.authCompanyWebServiceDetail = authCompanyWebServiceDetail;
        this.grantAccessAll = grantAccessAll ?? Access.No
    }
}