import IvsVersionHistory from "../domain/entities/ivsVersionHistory";
import ReportMigrationSet from "../domain/entities/reportMigrationSet";
import ReportRepository from "../domain/repositories/reportRepository";

export default class ReportService {
    constructor(private reportRepository: ReportRepository) {}

    getIvsHistoryReport = async (ruleGUID: string): Promise<IvsVersionHistory> => {
        return this.reportRepository.getIvsHistoryReport(ruleGUID);
    };

    getMigrationSetContentReport = async (migrationSetGUID: string): Promise<ReportMigrationSet> => {
        return this.reportRepository.getMigrationSetContentReport(migrationSetGUID);
    };
}
