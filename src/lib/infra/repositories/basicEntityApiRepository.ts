import BasicEntity from '../../domain/entities/basicEntity';
import { EntityType } from '../../domain/enums/entityType';
import BasicEntityRepository from '../../domain/repositories/basicEntityRepository';
import { ApiGateway } from '../config/apiGateway';

export default class BasicEntityApiRepository implements BasicEntityRepository {
    constructor(private api: ApiGateway) { }

    getPrimaryCompanies = async (): Promise<BasicEntity[]> => {
        return this.api.getArray(`/entities/basic/primaryCompanies`, { outType: BasicEntity });
    };

    getSubCompanies = async (companyGuid: string): Promise<BasicEntity[]> => {
        return this.api.getArray(`/entities/basic/subCompanies?companyGuid=${companyGuid}`, { outType: BasicEntity });
    };

    getProductsByCompanyGuid = async (companyGuid: string): Promise<BasicEntity[]> => {
        return this.api.getArray(`/entities/basic/products?companyGuid=${companyGuid}`, { outType: BasicEntity });
    };

    getPlans = async (guid: string, overrideType: EntityType): Promise<BasicEntity[]> => {
        return this.api.getArray(`/entities/basic/plans?guid=${guid}&overrideType=${overrideType}`, {
            outType: BasicEntity,
        });
    };

    getTransactions = async (guid: string, overrideType: EntityType): Promise<BasicEntity[]> => {
        return this.api.getArray(`/entities/basic/transactions?guid=${guid}&overrideType=${overrideType}`, {
            outType: BasicEntity,
        });
    };

    getAllTransactions = async (): Promise<BasicEntity[]> => {
        return this.api.getArray(`/entities/basic/allTransactions`, {
            outType: BasicEntity,
        });
    };

    getRequirements = async (guid: string, overrideType?: EntityType): Promise<BasicEntity[]> => {
        return this.api.getArray(
            `/entities/basic/requirements?guid=${guid}${overrideType ? `&overrideType=${overrideType}` : ''}`,
            {
                outType: BasicEntity,
            },
        );
    };

    getFundByCompanyGuid = async (companyGuid: string): Promise<BasicEntity[]> => {
        return this.api.getArray(`/entities/basic/fund?companyGuid=${companyGuid}`, { outType: BasicEntity });
    };
}
