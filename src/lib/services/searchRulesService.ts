import Company from '../domain/entities/company';
import Plan from '../domain/entities/plan';
import Product from '../domain/entities/product';
import { SearchResponse } from '../domain/entities/searchResponse';
import Transaction from '../domain/entities/transaction';
import TransactionProcess from '../domain/entities/transactionProcess';
import { ValidSearchTable } from '../domain/enums/validSearchTableEnum';
import CompanyRepository from '../domain/repositories/companyRepository';
import SearchRulesRepository from '../domain/repositories/searchRulesRepository';

export default class SearchRulesService {
    constructor(private searchRulesRepository: SearchRulesRepository, private companyRepository: CompanyRepository) {}

    getSearchResponsesBySearchTerm = async (
        searchTerm: string,
        validSearchTables: ValidSearchTable[],
        companyGuid: string,
        productGuid: string,
        planGuid: string,
    ): Promise<SearchResponse[]> => {
        return this.searchRulesRepository.getSearchResponsesBySearchTerm(
            searchTerm,
            validSearchTables,
            companyGuid,
            productGuid,
            planGuid,
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
        return this.searchRulesRepository.getSearchResponsesByFields(
            ruleNameSearchTerm,
            xmlSearchTerm,
            validSearchTables,
            companyGuid,
            productGuid,
            planGuid,
        );
    };

    getAllCompanies = async (): Promise<Company[]> => {
        return this.searchRulesRepository.getAllCompanies();
    };

    getPrimaryCompanies = async (): Promise<Company[]> => {
        return this.companyRepository.getPrimaryCompanies();
    };

    getSubCompanies = async (): Promise<Company[]> => {
        return this.companyRepository.getSubCompanies();
    };

    getProductsByCompanyGuid = async (companyGuid: string): Promise<Product[]> => {
        return this.searchRulesRepository.getProductsByCompanyGuid(companyGuid);
    };

    getPlansByProductGuidOrCompanyGuid = async (productGuid: string, companyGuid: string): Promise<Plan[]> => {
        return this.searchRulesRepository.getPlansByProductGuidOrCompanyGuid(productGuid, companyGuid);
    };

    getTransactionsByPlanGuid = async (planGuid: string): Promise<Transaction[]> => {
        return this.searchRulesRepository.getTransactionsByPlanGuid(planGuid);
    };

    getTransactionsProcessByPlanGuid = async (planGuid: string): Promise<TransactionProcess[]> => {
        return this.searchRulesRepository.getTransactionsProcessByPlanGuid(planGuid);
    }; 
    getTransactionsByProductGuid = async (productGuid: string): Promise<Transaction[]> => {
        return this.searchRulesRepository.getTransactionsByProductGuid(productGuid);
    };

    isBusinessRuleExist = async (searchTerm: string): Promise<boolean> => {
        return this.searchRulesRepository.isBusinessRuleExist(searchTerm);
    };
    
    isMapGroupExist = async (searchTerm: string): Promise<boolean> => {
        return this.searchRulesRepository.isMapGroupExist(searchTerm);
    };
}
