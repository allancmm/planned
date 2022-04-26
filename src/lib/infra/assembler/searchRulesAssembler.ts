import { ValidSearchTable } from '../../domain/enums/validSearchTableEnum';
import { SearchRulesRequest } from '../request/searchRulesRequest';

export const toSearchRequest = (
    ruleNameSearchTerm: string,
    xmlSearchTerm: string,
    validSearchTables: ValidSearchTable[],
    companyGuid: string,
    productGuid: string,
    planGuid: string,
): SearchRulesRequest => {
    if (ruleNameSearchTerm) {
        return {
            searchString: ruleNameSearchTerm,
            searchType: 'NAME',
            validSearchTables: validSearchTables.map((validSearchTable) => validSearchTable.name),
            companyGuid: companyGuid,
            productGuid: productGuid,
            planGuid: planGuid,
        };
    } else {
        return {
            searchString: xmlSearchTerm,
            searchType: 'XML',
            validSearchTables: validSearchTables.map((validSearchTable) => validSearchTable.name),
            companyGuid: companyGuid,
            productGuid: productGuid,
            planGuid: planGuid,
        };
    }
};
