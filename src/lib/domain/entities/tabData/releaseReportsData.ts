import { EntityType } from "../../enums/entityType";
import { ITabData } from "./iTabData";
import LogHistory from "../logHistoryRelease";

export default class ReleaseReportsData extends ITabData {
    clazz: string = 'ReleaseReports';

    logHistories : LogHistory[] = [];
    searchText = '';
    logHistoryChosen = new LogHistory();

    constructor() {
        super();
    }

    generateTabId(): string {
        return 'ReleaseReports-ReleaseReports';
    }
    getGuid(): string {
        return 'ReleaseReports';
    }
    getName(): string {
        return 'Release Reports';
    }
    getType(): EntityType {
        return '';
    }
    getExtra(): string {
        return 'Release Reports';
    }
}
