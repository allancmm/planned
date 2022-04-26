import ReleaseReportStatusTypeCode from "../enums/releaseReportStatus";
import { immerable } from "immer";

export default class LogHistoryRelease {
    [immerable] = true;

    logHistoryGuid = '';
    updatedGMT = new Date();
    updatedBy = '';
    action = '';
    status: ReleaseReportStatusTypeCode = '';
    remoteRepositoryUrl = '';
    comment = '';
    releaseGuid = '';
    releaseName = '';
    logFileName = '';
    logData = '';
    releaseTemplate = '';
    commitId = '';
    manifestData = '';
}