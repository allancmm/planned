import LogHistory from "../../domain/entities/logHistoryRelease";
import ReleaseReportHistoryRepository from "../../domain/repositories/releaseReportHistoryRepository";
import { ApiGateway } from "../config/apiGateway";

export default class ReleaseReportHistoryApiRepository implements ReleaseReportHistoryRepository {
    constructor(private api: ApiGateway) {}
    getLogHistoryList= async(): Promise<LogHistory[]> => {
        return this.api.getArray(
            `/releases/history`,
            {
                outType: LogHistory,
            },
        );
    }
}
