import ResultSqlScript from '../entities/resultSqlScript';

export default interface SqlScriptRepository {
    getResultSqlScript(ruleGuid: string): Promise<ResultSqlScript>;
    getSqlScriptinfo(ruleGuid: string): Promise<ResultSqlScript>;
    hasAccessToRunSqlScript(): Promise<boolean>;
}
