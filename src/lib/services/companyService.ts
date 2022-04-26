import Company from '../domain/entities/company';
import CompanyList from '../domain/entities/companyList';
import CompanyRepository from '../domain/repositories/companyRepository';

export default class CompanyService {
    constructor(private companyRepository: CompanyRepository) {}

    getCompanyList = async (): Promise<CompanyList> => {
        return this.companyRepository.getCompanyList();
    };

    getSubAndPrimaryCompanyList = async (): Promise<CompanyList> => {
        return this.companyRepository.getSubAndPrimaryCompanyList();
    };

    getOverrideCompanies = async (typeCode: string, name: string): Promise<Company[]> => {
        if (!typeCode || !name) {
            return Promise.resolve([]);
        }
        return this.companyRepository.getOverrideCompanies(typeCode, name);
    };

    getPrimaryCompanies = async (): Promise<Company[]> => {
        return this.companyRepository.getPrimaryCompanies();
    };

    getSubCompanies = async (): Promise<Company[]> => {
        return this.companyRepository.getSubCompanies();
    };
}
