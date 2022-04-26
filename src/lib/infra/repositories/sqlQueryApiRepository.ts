import SqlQueryRequest from '../../domain/entities/sqlQueryRequest';
import SqlQueryRepository from '../../domain/repositories/sqlQueryRepository';
import {ApiGateway} from '../config/apiGateway';

export default class SqlQueryApiRepository implements SqlQueryRepository {
    constructor(private api: ApiGateway) {}

    getResultFromExecuteQuery = async (query: string): Promise<any> => {
        const sqlQueryRequest: SqlQueryRequest = {sqlStatement: query, maxColumnLimit: 0, maxRowLimit: 0}
        return this.api.post(`/editor/executeSql/query`, sqlQueryRequest, { inType: SqlQueryRequest });
    }
}