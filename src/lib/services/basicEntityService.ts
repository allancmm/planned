import BasicEntity from '../domain/entities/basicEntity';
import { EntityType } from '../domain/enums/entityType';
import BasicEntityRepository from '../domain/repositories/basicEntityRepository';

export default class BasicEntityService {
    constructor(private basicEntityRepository: BasicEntityRepository) { }

    getPrimaryCompanies = async (): Promise<BasicEntity[]> => {
        return this.basicEntityRepository.getPrimaryCompanies();
    };

    getSubCompanies = async (companyGuid: string): Promise<BasicEntity[]> => {
        return this.basicEntityRepository.getSubCompanies(companyGuid);
    };

    getProductsByCompanyGuid = async (companyGuid: string): Promise<BasicEntity[]> => {
        return this.basicEntityRepository.getProductsByCompanyGuid(companyGuid);
    };

    getPlans = async (guid: string, overrideType: EntityType): Promise<BasicEntity[]> => {
        return this.basicEntityRepository.getPlans(guid, overrideType);
    };

    getTransactions = async (guid: string, overrideType: EntityType): Promise<BasicEntity[]> => {
        return this.basicEntityRepository.getTransactions(guid, overrideType);
    };

    getAllTransactions = async (): Promise<BasicEntity[]> => {
        return this.basicEntityRepository.getAllTransactions();
    };
    
    getRequirements = async (guid: string, overrideType?: EntityType): Promise<BasicEntity[]> => {
        return this.basicEntityRepository.getRequirements(guid, overrideType);
    };

    getFundByCompanyGuid = async (companyGuid: string): Promise<BasicEntity[]> => {
        return this.basicEntityRepository.getFundByCompanyGuid(companyGuid);
    };

}
