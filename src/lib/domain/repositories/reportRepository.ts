import IvsVersionHistory from "../entities/ivsVersionHistory";
import ReportMigrationSet from "../entities/reportMigrationSet";

export default interface ReportRepository {
    getIvsHistoryReport(ruleGUID: string): Promise<IvsVersionHistory>;
    getMigrationSetContentReport(migrationSetGUID: string): Promise<ReportMigrationSet>;
}
