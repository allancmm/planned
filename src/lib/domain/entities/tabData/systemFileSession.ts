import { ITabData } from "./iTabData";
import { EntityType } from "../../enums/entityType";
import { Type } from "class-transformer";
import SystemFileType from "../../enums/systemFileType";

export default class SystemFileSession extends ITabData {
    clazz: string = 'SystemFileSession';

    @Type(() => String)
    public codeSystemFile: SystemFileType;

    @Type(() => String)
    public nameSystemFile: string;

    constructor(codeSystemFile: SystemFileType, nameSystemFile: string) {
        super();
        this.codeSystemFile = codeSystemFile;
        this.nameSystemFile = nameSystemFile;
    }

    generateTabId(): string {
        return 'SystemFileSession_' + this.codeSystemFile;
    }

    getExtra(): string {
        return 'System File';
    }

    getGuid(): string {
        return '';
    }

    getName(): string {
        return this.nameSystemFile;
    }

    getType(): EntityType {
        return '';
    }
}