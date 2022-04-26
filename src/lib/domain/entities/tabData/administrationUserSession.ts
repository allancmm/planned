import { Type } from "class-transformer";
import { ITabData } from "./iTabData";
import { EntityType } from '../../enums/entityType';
import { User } from "../user";

export default class AdministrationUserSession extends  ITabData {

    clazz: string = "AdministrationUserSession";

    @Type(() => User )
    public user: User = new User();

    constructor(user : User) {
        super();
        this.user = user;
    }

    generateTabId(): string {
        return `AdministrationUserSession - ${this.user.userGuid}`;
    }

    getGuid(): string {
        return this.generateTabId();
    }

    getName(): string {
        return this.user.userName;
    }

    getType(): EntityType {
        return '';
    }

    getExtra(): string {
        return 'Administration User';
    }

}