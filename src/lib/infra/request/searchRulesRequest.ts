export class SearchRulesRequest {
    public searchString: string = '';
    public searchType: 'NAME' | 'XML' | 'QUERY' = 'NAME';
    public validSearchTables: string[] = [];
    public companyGuid: string = '';
    public productGuid: string = '';
    public planGuid: string = '';
}
