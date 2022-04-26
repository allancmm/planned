export default interface SqlQueryRepository {
    getResultFromExecuteQuery(query: string): Promise<any>
}