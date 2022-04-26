import IvsVersionHistory from "../../domain/entities/ivsVersionHistory";
import ReportMigrationSet from "../../domain/entities/reportMigrationSet";
import ReportRepository from "../../domain/repositories/reportRepository";
import { ApiGateway } from "../config/apiGateway";

export default class ReportApiRepository implements ReportRepository {
    constructor(private api: ApiGateway) { }

    getMigrationSetContentReport = async (migrationSetGUID: string): Promise<ReportMigrationSet> => {
        return this.api.get(`/oipa/reports/migrationSet/content/${migrationSetGUID}`, { outType: ReportMigrationSet });
    }

    getIvsHistoryReport = async (ruleGUID: string): Promise<IvsVersionHistory> => {
        return this.api.get(`/oipa/reports/rules/ivshistory/${ruleGUID}`, { outType: IvsVersionHistory });
    }
}
