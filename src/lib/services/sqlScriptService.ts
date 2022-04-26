import ResultSqlScript from '../domain/entities/resultSqlScript';
import SqlScriptRepository from '../domain/repositories/sqlScriptRepository';

export default class SqlScriptService {
    constructor(private sqlScriptRepository: SqlScriptRepository) {}

    getResultSqlScript = async (ruleGuid: string): Promise<ResultSqlScript> => {
        return this.sqlScriptRepository.getResultSqlScript(ruleGuid);
    };

    getSqlScriptinfo = async (ruleGuid: string): Promise<ResultSqlScript> => {
        return this.sqlScriptRepository.getSqlScriptinfo(ruleGuid);
    };

    hasAccessToRunSqlScript = async (): Promise<boolean> => {
        return this.sqlScriptRepository.hasAccessToRunSqlScript();
    };
}
