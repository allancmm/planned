import BasicEntity from '../entities/basicEntity';
import { EntityType } from '../enums/entityType';

export default interface BasicEntityRepository {
    getPrimaryCompanies(): Promise<BasicEntity[]>;
    getSubCompanies(companyGuid: string): Promise<BasicEntity[]>;
    getProductsByCompanyGuid(companyGuid: string): Promise<BasicEntity[]>;
    getPlans(guid: string, overrideType: EntityType): Promise<BasicEntity[]>;
    getTransactions(guid: string, overrideType: EntityType): Promise<BasicEntity[]>;
    getAllTransactions(): Promise<BasicEntity[]>;
    getRequirements(guid: string, overrideType?: EntityType): Promise<BasicEntity[]>;
    getFundByCompanyGuid(companyGuid: string): Promise<BasicEntity[]>;
}
