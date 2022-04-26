import SqlQueryRepository from '../domain/repositories/sqlQueryRepository';

export default class SqlQueryService {
    constructor(private sqlQueryRepository: SqlQueryRepository) {}

    getResultFromExecuteQuery = async (query: string): Promise<any> => {
        return this.sqlQueryRepository.getResultFromExecuteQuery(query);
    };
}