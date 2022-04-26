import CompanyList from '../entities/companyList';
import Company from '../entities/company';

export default interface CompanyRepository {
    getCompanyList(): Promise<CompanyList>;
    getOverrideCompanies(typeCode: string, name: string): Promise<Company[]>;
    getPrimaryCompanies(): Promise<Company[]>;
    getSubCompanies(): Promise<Company[]>;
    getSubAndPrimaryCompanyList(): Promise<CompanyList>;
}
