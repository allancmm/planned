import { intellisenseCache } from './intellisense';
import { tryInsert } from './intellisenseUtils';
import { TokenTag } from './parsingUtils';

export const getMVFieldAutocomplete = async (tags: TokenTag[], datatype?: string): Promise<string[]> => {
    const list1 = await getFields(tags, datatype, 'Activity:');
    const list2 = await getPolicyFields(datatype, 'Policy:');
    const list3 = await getClientFields(datatype, 'Client:');
    return list1.concat(list2.concat(list3)).sort();
};

export const getPolicyFields = async (datatype?: string, prefix: string = '') => {
    const list: string[] = [];

    const policyFields = await intellisenseCache.loadRule('PolicyScreen');
    policyFields.fields?.forEach((f) => tryInsert(list, prefix + f.name));

    // Add fixed fields. These are hardcoded since they can't change
    if (!datatype || datatype === 'TEXT') {
        tryInsert(list, prefix + 'PolicyGUID');
        tryInsert(list, prefix + 'PolicyNumber');
        tryInsert(list, prefix + 'PolicyName');
        tryInsert(list, prefix + 'IssueStateCode');
        tryInsert(list, prefix + 'StatusCode');
        tryInsert(list, prefix + 'CompanyGUID');
        tryInsert(list, prefix + 'PlanGUID');
    }
    if (!datatype || datatype === 'DATE') {
        tryInsert(list, prefix + 'CreationDate');
        tryInsert(list, prefix + 'PlanDate');
        tryInsert(list, prefix + 'UpdatedGMT');
    }

    return list.sort();
};

export const getSegmentFields = async (datatype?: string, prefix: string = '') => {
    const list: string[] = [];

    const segmentFields = await intellisenseCache.loadRule('SegmentScreen');
    segmentFields.fields?.forEach((f) => tryInsert(list, prefix + f.name));

    // Add fixed fields. These are hardcoded since they can't change
    if (!datatype || datatype === 'TEXT') {
        tryInsert(list, prefix + 'SegmentGUID');
        tryInsert(list, prefix + 'TypeCode');
        tryInsert(list, prefix + 'StatusCode');
    }
    if (!datatype || datatype === 'DATE') {
        tryInsert(list, prefix + 'EffectiveDate');
    }

    return list.sort();
};

export const getClientFields = async (datatype?: string, prefix: string = '') => {
    const list: string[] = [];

    const clientFields = await intellisenseCache.loadRule('ClientScreen');
    clientFields.fields?.forEach((f) => tryInsert(list, prefix + f.name));

    // Add fixed fields. These are hardcoded since they can't change
    if (!datatype || datatype === 'TEXT') {
        tryInsert(list, prefix + 'ClientGUID');
        tryInsert(list, prefix + 'CompanyName');
        tryInsert(list, prefix + 'LastName');
        tryInsert(list, prefix + 'FirstName');
        tryInsert(list, prefix + 'TypeCode');
        tryInsert(list, prefix + 'MiddleInitial');
        tryInsert(list, prefix + 'Prefix');
        tryInsert(list, prefix + 'Suffix');
        tryInsert(list, prefix + 'Sex');
        tryInsert(list, prefix + 'TaxID');
        tryInsert(list, prefix + 'Email');
        tryInsert(list, prefix + 'UpdatedGMT');
        tryInsert(list, prefix + 'LegalResidenceCountryCode');
        tryInsert(list, prefix + 'Radio1');
        tryInsert(list, prefix + 'Radio2');
        tryInsert(list, prefix + 'Comb1');
        tryInsert(list, prefix + 'Comb2');
        tryInsert(list, prefix + 'TextField1');
        tryInsert(list, prefix + 'TextField2');
        tryInsert(list, prefix + 'Date1');
        tryInsert(list, prefix + 'Date2');
    }
    if (!datatype || datatype === 'DATE') {
        tryInsert(list, prefix + 'DateOfBirth');
        tryInsert(list, prefix + 'DateOfDeath');
    }

    return list.sort();
};

export const getRoleFields = async (datatype?: string, prefix: string = '') => {
    const list: string[] = [];

    const clientFields = await intellisenseCache.loadRule('RoleScreen');
    clientFields.fields?.forEach((f) => tryInsert(list, prefix + f.name));

    // Add fixed fields. These are hardcoded since they can't change
    if (!datatype || datatype === 'TEXT') {
        tryInsert(list, prefix + 'RoleGUID');
        tryInsert(list, prefix + 'CompanyGUID');
        tryInsert(list, prefix + 'PolicyGUID');
        tryInsert(list, prefix + 'SegmentGUID');
        tryInsert(list, prefix + 'ClientGUID');
        tryInsert(list, prefix + 'StateCode');
        tryInsert(list, prefix + 'RoleCode');
        tryInsert(list, prefix + 'StatusCode');
    }
    if (!datatype || datatype === 'DECIMAL') {
        tryInsert(list, prefix + 'RolePercent');
        tryInsert(list, prefix + 'RoleAmount');
    }
    return list.sort();
};

export const getAddressFields = async (datatype?: string, prefix: string = '') => {
    const list: string[] = [];

    const clientFields = await intellisenseCache.loadRule('AddressScreen');
    clientFields.fields?.forEach((f) => tryInsert(list, prefix + f.name));

    // Add fixed fields. These are hardcoded since they can't change
    if (!datatype || datatype === 'TEXT') {
        tryInsert(list, prefix + 'AddressGUID');
    }

    return list;
};

export const getFields = async (tags: TokenTag[], filterDataType?: string, prefix: string = ''): Promise<string[]> => {
    const list: string[] = [];
    tags.reverse(); // start from the top

    let inField = false;
    let fieldDataType = '';
    let fieldName = '';
    if (filterDataType === null || filterDataType === 'DATE') {
        tryInsert(list, prefix + 'EffectiveDate');
    }

    for (const t of tags) {
        if (t.tag.includes('Field')) {
            if (t.isClosed()) {
                inField = false;
                if (!filterDataType || fieldDataType === filterDataType) {
                    tryInsert(list, prefix + fieldName);
                }
            } else {
                inField = true;
            }
            fieldDataType = '';
            fieldName = '';
        }

        if (t.tag === 'CopyBook' && t.content) {
            const rule = await intellisenseCache.loadRule(t.content);
            const fields = rule.fields?.map((f) => f.name) ?? [];
            tryInsert(list, ...fields);
        }

        if (inField) {
            if (t.tag === 'Name') {
                fieldName = t.content;
            }
            if (t.tag === 'DataType') {
                fieldDataType = t.content;
            }
        }
    }
    tags.reverse();
    return list.sort();
};
