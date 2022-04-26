import { ITabData } from "./iTabData";
import { EntityType } from "../../enums/entityType";
import LogReleaseReport from "../logHistoryRelease";
import {dateToString, FORMAT_PALETTE} from "../../../util/date";

export default class ViewLogReleaseReportSession extends ITabData {
    clazz = 'ViewLogReleaseReportSession';

    logReleaseReport: LogReleaseReport;

    constructor(logReleaseReport: LogReleaseReport) {
        super();
        this.logReleaseReport = logReleaseReport;
    }
    generateTabId(): string {
        return `${this.clazz}_${this.logReleaseReport.logHistoryGuid}`;
    }

    getExtra(): string {
        return "View Log Release Report";
    }

    getGuid(): string {
        return this.logReleaseReport.logHistoryGuid;
    }

    getName(): string {
        return `Release Detail - ${dateToString(this.logReleaseReport.updatedGMT, FORMAT_PALETTE)}`;
    }

    getType(): EntityType {
        return "LOG_HISTORY";
    }

}