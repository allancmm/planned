import LogHistory from "../domain/entities/logHistoryRelease";
import ReleaseReportHistoryRepository from "../domain/repositories/releaseReportHistoryRepository";

export default class ReleaseReportHistoryService {
    constructor(private releaseReportHistoryRepository: ReleaseReportHistoryRepository) { }
    getLogHistoryList = async (): Promise<LogHistory[]> => {
        return this.releaseReportHistoryRepository.getLogHistoryList();
    };
}
