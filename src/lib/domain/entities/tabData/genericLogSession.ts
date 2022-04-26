import { EntityType } from "../../enums/entityType";
import {ITabData} from "./iTabData";

export interface RowHeaderGenericLog {
    fields: { [key: string] : string }
}

export default class GenericLogSession extends ITabData {
    clazz = 'GenericLogSession';

    tabId: string;
    tabName: string;
    rowsHeader: RowHeaderGenericLog[];
    logData: string[];

    constructor(tabId: string, tabName: string, rowsHeader: RowHeaderGenericLog[], logData: string[]) {
        super();
        this.tabId = tabId;
        this.tabName = tabName;
        this.rowsHeader = rowsHeader;
        this.logData = logData;
    }

    generateTabId(): string {
        return `${this.clazz} - ${this.tabId}`
    }
    getGuid(): string {
       return this.tabId || this.clazz;
    }
    getName(): string {
        return this.tabName || '';
    }
    getType(): EntityType {
        return '';
    }
    getExtra(): string {
        return '';
    }

}