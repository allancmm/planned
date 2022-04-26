import { Type } from "class-transformer";
import { ITabData } from "./iTabData";
import { EntityType } from '../../enums/entityType';
import { SecurityRole } from "../securityRole";

export default class AdministrationUserGroupSession extends  ITabData {
    clazz: string = "AdministrationUserGroupSession";

    @Type(() => SecurityRole )
    public userGroup: SecurityRole = new SecurityRole();

    constructor(userGroup : SecurityRole) {
        super();
        this.userGroup = userGroup;
    }

    generateTabId(): string {
        return `AdministrationUserGroupSession - ${this.userGroup.securityRoleGuid}`;
    }

    getGuid(): string {
        return this.generateTabId();
    }

    getName(): string {
        return this.userGroup.securityRoleName;
    }

    getType(): EntityType {
        return '';
    }

    getExtra(): string {
        return 'Administration User Group';
    }

}