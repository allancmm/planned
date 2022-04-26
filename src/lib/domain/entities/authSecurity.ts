import { v4 as uuid } from "uuid";
import {immerable} from "immer";

export default class AuthSecurity {
    [immerable] = true
    public id: string;
    public name: string;
    public securityLevelCode: string;

    constructor(id?: string, name?: string, securityLevelCode?: string) {
        this.id = id ?? uuid();
        this.name = name ?? '';
        this.securityLevelCode = securityLevelCode ?? '';
    }
}