import LogHistory from "../entities/logHistoryRelease";

export default interface ReleaseReportHistoryRepository {
    getLogHistoryList(): Promise<LogHistory[]>;
}
