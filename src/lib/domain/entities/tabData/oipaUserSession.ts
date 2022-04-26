import {ITabData} from "./iTabData";
import {EntityType} from "../../enums/entityType";
import OipaUserList from "../oipaUserList";

export default class OipaUserSession extends ITabData {
    clazz: string = "OipaUserSession";

    public oipaUserList: OipaUserList =  new OipaUserList();

    generateTabId(): string {
        return 'OipaUserSession';
    }

    getGuid(): string {
        return this.generateTabId();
    }

    getName(): string {
        return 'OIPA User';
    }

    getType(): EntityType {
        return 'OIPA_USER';
    }

    getExtra(): string {
        return 'Oipa User';
    }
}