import ResultSqlScript from '../../domain/entities/resultSqlScript';
import SqlScriptRepository from '../../domain/repositories/sqlScriptRepository';
import { ApiGateway } from '../config/apiGateway';

export default class SqlScriptApiReposiroty implements SqlScriptRepository {
    constructor(private api: ApiGateway) {}

    getResultSqlScript = async (ruleGuid: string): Promise<ResultSqlScript> => {
        return this.api.post(`/editor/executeSqlScript/`, ruleGuid, {
            outType: ResultSqlScript,
        });
    };

    getSqlScriptinfo = async (ruleGuid: string): Promise<ResultSqlScript> => {
        return this.api.get(`/editor/getSqlScriptRow/${ruleGuid}`, {
            outType: ResultSqlScript,
        });
    };

    hasAccessToRunSqlScript = async (): Promise<boolean> => {
        return this.api.get(`/editor/userHasPrivilegeToRunSql`);
    };
}
