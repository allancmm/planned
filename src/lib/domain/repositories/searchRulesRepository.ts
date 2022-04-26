import Company from '../entities/company';
import Plan from '../entities/plan';
import Product from '../entities/product';
import { SearchResponse } from '../entities/searchResponse';
import Transaction from '../entities/transaction';
import TransactionProcess from '../entities/transactionProcess';
import { ValidSearchTable } from '../enums/validSearchTableEnum';

export default interface SearchRulesRepository {
    getSearchResponsesBySearchTerm(
        searchTerm: string,
        validSearchTables: ValidSearchTable[],
        companyGuid: string,
        productGuid: string,
        planGuid: string,
    ): Promise<SearchResponse[]>;

    getSearchResponsesByFields(
        ruleNameSearchTerm: string,
        xmlSearchTerm: string,
        validSearchTables: ValidSearchTable[],
        companyGuid: string,
        productGuid: string,
        planGuid: string,
    ): Promise<SearchResponse[]>;

    getAllCompanies(): Promise<Company[]>;

    getProductsByCompanyGuid(companyGuid: string): Promise<Product[]>;

    getPlansByProductGuidOrCompanyGuid(productGuid: string, companyGuid: string): Promise<Plan[]>;

    getTransactionsByProductGuid(productGuid: string): Promise<Transaction[]>;

    getTransactionsByPlanGuid(planGuid: string): Promise<Transaction[]>;
    
    getTransactionsProcessByPlanGuid(planGuid: string): Promise<TransactionProcess[]>;

    isBusinessRuleExist(searchTerm: string): Promise<boolean>;

    isMapGroupExist(searchTerm: string): Promise<boolean>;
}
