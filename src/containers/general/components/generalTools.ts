import BasicEntity from '../../../lib/domain/entities/basicEntity';
import { EntityType } from '../../../lib/domain/enums/entityType';
import BasicEntityService from '../../../lib/services/basicEntityService';
import { OverrideEnumType } from './overrideEnum';

const fetchData = async (
    code: string,
    guid: string,
    basicEntityService: BasicEntityService,
    underEntity?: EntityType,
): Promise<BasicEntity[]> => {
    switch (code) {
        case OverrideEnumType.PCOMPANY.code:
            return basicEntityService.getPrimaryCompanies();
        case OverrideEnumType.SCOMPANY.code:
            return basicEntityService.getSubCompanies(guid);
        case OverrideEnumType.PRODUCT.code:
            return basicEntityService.getProductsByCompanyGuid(guid);
        case OverrideEnumType.PLAN.code:
            return basicEntityService.getPlans(guid, underEntity ?? 'COMPANY');
        case OverrideEnumType.TRANSACTION.code:
            return basicEntityService.getTransactions(guid, underEntity ?? 'PRODUCT');
        case OverrideEnumType.FUND.code:
            return basicEntityService.getFundByCompanyGuid(guid);
        case OverrideEnumType.REQUIREMENT.code:
            return basicEntityService.getRequirements(guid, underEntity);
        case OverrideEnumType.PROGRAM_DEFINITION.code:
            return [];
        case OverrideEnumType.GROUP_CUSTOMER.code:
            return [];
        default:
            return [];
    }
};

const getOverrideElements = (code: string) => {
    switch (code) {
        case OverrideEnumType.PCOMPANY.code:
            return [OverrideEnumType.PCOMPANY];
        case OverrideEnumType.SCOMPANY.code:
            return [OverrideEnumType.PCOMPANY, OverrideEnumType.SCOMPANY];
        case OverrideEnumType.PRODUCT.code:
            return [OverrideEnumType.PCOMPANY, OverrideEnumType.SCOMPANY, OverrideEnumType.PRODUCT];
        case OverrideEnumType.PLAN.code:
            return [
                OverrideEnumType.PCOMPANY,
                OverrideEnumType.SCOMPANY,
                OverrideEnumType.PRODUCT,
                OverrideEnumType.PLAN,
            ];
        case OverrideEnumType.TRANSACTION.code:
            return [
                OverrideEnumType.PCOMPANY,
                OverrideEnumType.SCOMPANY,
                OverrideEnumType.PRODUCT,
                OverrideEnumType.PLAN,
                OverrideEnumType.TRANSACTION,
            ];
        case OverrideEnumType.FUND.code:
            return [OverrideEnumType.PCOMPANY, OverrideEnumType.FUND];
        case OverrideEnumType.REQUIREMENT.code:
            return [
                OverrideEnumType.PCOMPANY,
                OverrideEnumType.SCOMPANY,
                OverrideEnumType.PRODUCT,
                OverrideEnumType.PLAN,
                OverrideEnumType.REQUIREMENT,
            ];
        case OverrideEnumType.PROGRAM_DEFINITION.code:
            return [];
        case OverrideEnumType.GROUP_CUSTOMER.code:
            return [];
        default:
            return [];
    }
};

export { fetchData, getOverrideElements };
