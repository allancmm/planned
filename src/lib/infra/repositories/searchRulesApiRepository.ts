import Company from '../../domain/entities/company';
import Plan from '../../domain/entities/plan';
import Product from '../../domain/entities/product';
import { SearchResponse } from '../../domain/entities/searchResponse';
import Transaction from '../../domain/entities/transaction';
import TransactionProcess from '../../domain/entities/transactionProcess';
import { ValidSearchTable } from '../../domain/enums/validSearchTableEnum';
import SearchRulesRepository from '../../domain/repositories/searchRulesRepository';
import * as SearchRulesAssembler from '../assembler/searchRulesAssembler';
import { ApiGateway } from '../config/apiGateway';
import { SearchRulesRequest } from '../request/searchRulesRequest';

export default class SearchRulesApiRepository implements SearchRulesRepository {
    constructor(private api: ApiGateway) {}

    getSearchResponsesBySearchTerm = async (
        searchTerm: string,
        validSearchTables: ValidSearchTable[],
        companyGuid: string,
        productGuid: string,
        planGuid: string,
    ): Promise<SearchResponse[]> => {
        return this.api.postReturnArray(
            `/search/query`,
            {
                searchString: searchTerm,
                searchType: 'QUERY',
                validSearchTables: validSearchTables.map((validSearchTable) => validSearchTable.name),
                companyGuid: companyGuid,
                productGuid: productGuid,
                planGuid: planGuid,
            },
            {
                outType: SearchResponse,
                inType: SearchRulesRequest,
            },
        );
    };

    getSearchResponsesByFields = async (
        ruleNameSearchTerm: string,
        xmlSearchTerm: string,
        validSearchTables: ValidSearchTable[],
        companyGuid: string,
        productGuid: string,
        planGuid: string,
    ): Promise<SearchResponse[]> => {
        return this.api.postReturnArray(
            `/search/fields`,
            SearchRulesAssembler.toSearchRequest(
                ruleNameSearchTerm,
                xmlSearchTerm,
                validSearchTables,
                companyGuid,
                productGuid,
                planGuid,
            ),
            {
                outType: SearchResponse,
                inType: SearchRulesRequest,
            },
        );
    };

    getAllCompanies = async (): Promise<Company[]> => {
        return this.api.getArray(`/search/companies`, {
            outType: Company,
        });
    };

    getProductsByCompanyGuid = async (companyGuid: string): Promise<Product[]> => {
        return this.api.getArray(`/search/products?companyGuid=${companyGuid}`, {
            outType: Product,
        });
    };

    getPlansByProductGuidOrCompanyGuid = async (productGuid: string, companyGuid: string): Promise<Plan[]> => {
        return this.api.getArray(`/search/plans?productGuid=${productGuid}&companyGuid=${companyGuid}`, {
            outType: Plan,
        });
    };

    getTransactionsByPlanGuid = async (planGuid: string): Promise<Transaction[]> => {
        return this.api.getArray(`/search/transactions?planGuid=${planGuid}`, {
            outType: Transaction,
        });
    };

    getTransactionsProcessByPlanGuid = async (planGuid: string): Promise<TransactionProcess[]> => {
        return this.api.getArray(`/search/transactionsProcess?planGuid=${planGuid}`, {
            outType: TransactionProcess,
        });
    };

    getTransactionsByProductGuid = async (productGuid: string): Promise<Transaction[]> => {
        return this.api.getArray(`/search/transactions?productGuid=${productGuid}`, {
            outType: Transaction,
        });
    };

    isBusinessRuleExist = async (searchTerm: string): Promise<boolean> => {
        return this.api.get(`/search/isBusinessRuleExist?searchTerm=${searchTerm}`);
    };

    isMapGroupExist = async (searchTerm: string): Promise<boolean> => {
        return this.api.get(`/search/isMapGroupExist?searchTerm=${searchTerm}`);
    };
}
