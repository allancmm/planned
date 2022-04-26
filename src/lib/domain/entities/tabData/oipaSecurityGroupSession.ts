import { ITabData } from "./iTabData";
import { EntityType } from "../../enums/entityType";
import { Type } from "class-transformer";
import SecurityGroup from "../securityGroup";

export default class OIPASecurityGroupSession extends ITabData {
    clazz: string = "OipaSecurityGroup";
    @Type(() => SecurityGroup) public securityGroupManagement: SecurityGroup[] = [];

    generateTabId(): string {
        return 'OipaSecurityGroup';
    }

    getGuid(): string {
        return this.generateTabId();
    }

    getName(): string {
        return 'OIPA Security Group';
    }

    getType(): EntityType {
        return '';
    }

    getExtra(): string {
        return 'Oipa Security Group';
    }
}