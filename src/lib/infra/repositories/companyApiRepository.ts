import Company from '../../domain/entities/company';
import CompanyList from '../../domain/entities/companyList';
import CompanyRepository from '../../domain/repositories/companyRepository';
import { ApiGateway } from '../config/apiGateway';

export default class CompanyApiRepository implements CompanyRepository {
    constructor(private api: ApiGateway) { }
    getPrimaryCompanies = async (): Promise<Company[]> => {
        return this.api.getArray('/entities/primaryCompanies', { outType: Company });
    };

    getSubCompanies = async (): Promise<Company[]> => {
        return this.api.getArray('/entities/subCompanies', { outType: Company });
    };

    getCompanyList = async (): Promise<CompanyList> => {
        return this.api.get(`/companies/primary`, { outType: CompanyList });
    };

    getSubAndPrimaryCompanyList = async (): Promise<CompanyList> => {
        return this.api.get(`/companies/all`, { outType: CompanyList });
    };

    getOverrideCompanies = async (typeCode: string, name: string): Promise<Company[]> => {
        return this.api.getArray(`/entities/overrideCompanies?typeCode=${typeCode}&name=${name}`, { outType: Company });
    };
}
