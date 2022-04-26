import { immerable } from 'immer';
import { EntityType } from '../enums/entityType';
import AuthSecurity from "./authSecurity";

export default class AuthSecurityGroupData {
    [immerable] = true;
    entityGuid = '';
    entityType: EntityType = '';
    securityGroupGuid = '';
    authSecurityDetails: AuthSecurity[] = [];
    childPlanGuid = '';
    constructor(entityGuid: string, entityType: EntityType, securityGroupGuid: string, authSecurityDetails: AuthSecurity[], childPlanGuid: string) {
        this.entityGuid = entityGuid;
        this.entityType = entityType;
        this.securityGroupGuid = securityGroupGuid;
        this.authSecurityDetails = authSecurityDetails;
        this.childPlanGuid = childPlanGuid;
    }
}