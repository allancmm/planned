import { languages, IRange } from 'monaco-editor';
import { TokenTag } from './utils/parsingUtils';
import {
    getMVExpressionAutocomplete,
    getMathVariables,
    tryInsert,
    mvIsCorrectDataType,
    getValueList,
} from './utils/intellisenseUtils';
import {
    getMVFieldAutocomplete,
    getPolicyFields,
    getSegmentFields,
    getClientFields,
    getRoleFields,
    getAddressFields,
    getFields,
} from './utils/fieldsUtils';
import { getBuiltInFunctionsList } from './utils/schema';
import { intellisenseCache } from './utils/intellisense';

export const suggestMathVariableContent = async (
    line: TokenTag,
    tags: TokenTag[],
    range: IRange,
): Promise<languages.CompletionItem[]> => {
    const mvType = line.getAttribute('TYPE')?.value ?? '';
    let list: string[] = [];

    let mathTagToken: TokenTag | undefined = line;
    let mathID;
    while (
        mathTagToken &&
        (mathTagToken.tag === 'MathIF' ||
            mathTagToken.tag === 'MathLoop' ||
            mathTagToken.tag === 'MathVariables' ||
            mathTagToken.tag === 'MathVariable')
    ) {
        mathTagToken = mathTagToken.getParent(tags);
    }

    const mainTagToken = mathTagToken?.getParent(tags);
    const mainTag = mainTagToken?.tag;
    if (mainTag === 'ScreenMath') {
        mathID = mathTagToken?.getAttribute('ID')?.value;
    }
    const datatype = line.getAttribute('DATATYPE')?.value;

    switch (mvType) {
        case 'FIELD': {
            if (mainTag !== 'ScreenMath') {
                list = await getMVFieldAutocomplete(tags, datatype);
            }
            break;
        }
        case 'POLICYFIELD': {
            if (mainTag !== 'ScreenMath') {
                list = await getPolicyFields(datatype);
            }
            break;
        }
        case 'SEGMENTFIELD': {
            list = await getSegmentFields(datatype);
            break;
        }
        case 'FUNCTION': {
            list = getBuiltInFunctionsList(datatype);
            break;
        }
        case 'EXPRESSION': {
            list = await getMVExpressionAutocomplete(tags, datatype, mainTagToken, mathID);
            break;
        }
        case 'AGGREGATEFUNCTION': {
            // For all aggregate functions except "INDEX", show all datatypes
            list = await getMathVariables(
                tags,
                line.getAttribute('METHOD')?.value !== 'INDEX' ? undefined : datatype,
                mainTag,
                mathID,
                true,
                true,
            );
            break;
        }
        case 'COLLECTION': {
            if (!line.getAttribute('OPERATION')?.value) {
                list = suggestSQLKeywords();
            } else if (line.getAttribute('OPERATION')?.value === 'SETVALUE') {
                list = await getMathVariables(tags, datatype, mainTag, mathID, true, false);
            }
            break;
        }
        case 'COLLECTIONVALUE': {
            list = await getMathVariables(tags, 'MAP', mainTag, mathID, true, false);
            break;
        }
        case 'OBJECTFIELD': {
            const objectType = line.getAttribute('OBJECTNAME')?.value;
            if (objectType === 'Client') {
                list = await getClientFields(undefined, datatype);
            }
            if (objectType === 'Role') {
                list = await getRoleFields(undefined, datatype);
            }
            break;
        }
        case 'STRINGARRAY':
        case 'TEXTARRAY':
        case 'DATEARRAY':
        case 'NUMERICARRAY':
        case 'ACTIVITYARRAY': {
            const operation = line.getAttribute('OPERATION')?.value;
            if (operation === 'APPEND') {
                list = await getMathVariables(tags, datatype, mainTag, mathID, true, false);
            }
            if (operation === 'FILLBY-SQL') {
                list = suggestSQLKeywords();
            }
            break;
        }
        case 'ACTIVITY': {
            const operation = line.getAttribute('OPERATION')?.value;
            if (operation === 'SETVALUE') {
                list = await getMathVariables(tags, datatype, mainTag, mathID, true, false);
            }
            if (operation === 'CREATE' && line.content.indexOf("'") !== -1) {
                list = await intellisenseCache.loadTransactionList();
            }
            if (operation === 'CREATE' && line.content.indexOf("'") === -1) {
                list = await getMathVariables(tags, 'TEXT', mainTag, mathID, true, false);
            }
            break;
        }
        case 'MULTIFIELD': {
            const multifield = line.getAttribute('MULTIFIELD')?.value;

            if (multifield) {
                const rule = await intellisenseCache.loadRule(multifield);
                list = rule.fields?.map((f) => f.name) ?? [];
            }
            break;
        }
        case 'XML': {
            const list1 = await getMathVariables(tags, 'TEXT', mainTag, mathID, true, false);
            const list2 = await getMathVariables(tags, 'XML', mainTag, mathID, true, false);
            list = list1.concat(list2).sort();
            break;
        }
        case 'SQL': {
            list = suggestSQLKeywords();
        }
    }

    return list.map((l) => {
        return {
            label: l,
            kind: languages.CompletionItemKind.Reference,
            detail: l,
            insertText: l,
            range,
        };
    });
};

export const suggestTagContent = async (
    line: TokenTag,
    tags: TokenTag[],
    range: IRange,
): Promise<languages.CompletionItem[]> => {
    let list: string[] = [];

    switch (line.tag) {
        case 'Expression': {
            const trans = await intellisenseCache.loadRule(intellisenseCache.getRelatedTransactionGUID(), true, false);
            trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv)));
            list = list.concat(getBuiltInFunctionsList()).sort();
            break;
        }
        case 'Parameter': {
            const grandParent = line.getParent(tags)?.getParent(tags);
            let mathID;
            if (grandParent?.tag === 'MathVariable') {
                let mathToken: TokenTag | undefined = grandParent;
                while (
                    mathToken &&
                    (mathToken.tag === 'MathIF' ||
                        mathToken.tag === 'MathLoop' ||
                        mathToken.tag === 'MathVariables' ||
                        mathToken.tag === 'MathVariable')
                ) {
                    mathToken = mathToken.getParent(tags);
                }

                const mainTag = mathToken?.getParent(tags);
                if (mainTag?.tag === 'ScreenMath') {
                    mathID = mathToken?.getAttribute('ID')?.value;
                }
                const functionName = line.getParent(tags)?.getAttribute('FUNCTIONNAME')?.value;
                const paramName = line.getAttribute('NAME')?.value;
                if (functionName) {
                    const datatype = (await intellisenseCache.loadRule(functionName)).parameters?.find(
                        (p) => p.name === paramName,
                    )?.type;
                    let prefixActivity = 'Activity:';

                    if (mainTag?.tag === 'ScreenMath') {
                        prefixActivity = '';
                    }
                    const list1 = await getFields(tags, datatype, prefixActivity);
                    const list2 = await getMathVariables(tags, datatype, mainTag?.tag, mathID);
                    if (mainTag?.tag !== 'ScreenMath') {
                        const list3 = await getPolicyFields(datatype, 'Policy:');
                        const list4 = await getClientFields(datatype, 'Client:');
                        list = list1.concat(list2.concat(list3.concat(list4))).sort();
                    } else {
                        if (!datatype || datatype === 'TEXT') {
                            list = list1.concat(list2).concat('PolicyGUID').sort();
                        } else {
                            list = list1.concat(list2).sort();
                        }
                    }
                }
            }
            break;
        }
        case 'Action': {
            const type = line.getAttribute('ACTIONTYPE')?.value;
            if (type === 'ASSIGN') {
                list = await getActionVariablesAutocomplete(tags);
            }
            if (type === 'MATHCOLLECTION') {
                list = await getActionVariablesAutocomplete(tags, 'MAP');
            }
            if (type === 'SQLQUERY') {
                list = suggestSQLKeywords();
            }
            break;
        }
        case 'Query': {
            if (line.getAttribute('TYPE')?.value === 'SQL') {
                list = suggestSQLKeywords();
            }
            break;
        }
        case 'FromCollection': {
            const trans = await intellisenseCache.loadRule(intellisenseCache.getRelatedTransactionGUID(), true, false);
            trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv, 'MAP')));
            break;
        }
        case 'Comment': {
            const trans = await intellisenseCache.loadRule(intellisenseCache.getRelatedTransactionGUID(), true, false);
            trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv)));
            trans.fields?.forEach((f) => tryInsert(list, 'Activity:' + f));
            break;
        }
        case 'AmountField': {
            const trans = await intellisenseCache.loadRule(intellisenseCache.getRelatedTransactionGUID(), true, false);
            trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv, 'CURRENCY')));
            break;
        }
        case 'DetailField': {
            const trans = await intellisenseCache.loadRule(intellisenseCache.getRelatedTransactionGUID(), true, false);
            trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv, 'TEXT')));
            break;
        }
        case 'From': {
            const grandGrandParentTag = line.getParent(tags)?.getParent(tags)?.getParent(tags)?.tag;
            if (
                grandGrandParentTag &&
                [
                    'CopyToPolicyFields',
                    'Role',
                    'CopyToAddressFields',
                    'CopyToClientFields',
                    'CopyToSegmentFields',
                    'ActivityFields',
                    'PolicyRole',
                    'SegmentRole',
                    'Policy',
                    'Segment',
                ].includes(grandGrandParentTag)
            ) {
                const trans = await intellisenseCache.loadRule(
                    intellisenseCache.getRelatedTransactionGUID(),
                    true,
                    false,
                );
                trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv)));
                trans.fields?.forEach((f) => tryInsert(list, 'Activity:' + f));
            } else {
                list = await getMathVariables(tags, undefined, undefined, undefined, true);
            }
            break;
        }
        case 'Value': {
            const trans = await intellisenseCache.loadRule(intellisenseCache.getRelatedTransactionGUID(), true, false);
            trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv)));
            trans.fields?.forEach((f) => tryInsert(list, 'Activity:' + f));
            break;
        }
        case 'To': {
            const grandGrandParentTag = line.getParent(tags)?.getParent(tags)?.getParent(tags)?.tag;

            switch (grandGrandParentTag) {
                case 'CopyToPolicyFields':
                case 'Policy': {
                    list = await getPolicyFields();
                    break;
                }
                case 'CopyToAddressFields': {
                    list = await getAddressFields();
                    break;
                }
                case 'CopyToClientFields': {
                    list = await getClientFields();
                    break;
                }
                case 'CopyToSegmentFields':
                case 'Segment': {
                    list = await getSegmentFields();
                    break;
                }
                case 'PolicyRole':
                case 'Role':
                case 'SegmentRole': {
                    list = await getRoleFields();
                    break;
                }
                default: {
                    const transactionName = tags.find((t) => t.tag === 'Transaction')?.content;
                    if (transactionName) {
                        const trans = await intellisenseCache.loadRule(transactionName, true);
                        trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv)));
                        trans.fields?.forEach((f) => tryInsert(list, 'Activity:' + f));
                        tryInsert(list, 'EffectiveDate');
                    }
                    break;
                }
            }
            break;
        }
        case 'DataType': {
            const parent = line.getParent(tags)?.tag;
            if (parent === 'SpawnField') {
                const transactionName = tags.find((t) => t.tag === 'Transaction')?.content;
                const to = tags.find((t) => t.tag === 'To')?.content;
                if (transactionName) {
                    const trans = await intellisenseCache.loadRule(transactionName, true);
                    trans.fields?.forEach((f) => tryInsert(list, 'Activity:' + f.name, f.dataType === to));
                    if (list.length === 0) {
                        list = await getValueList(line);
                    }
                }
            } else {
                list = await getValueList(line);
            }
            break;
        }
        case 'Activity': {
            list = await getMathVariables(tags, 'ACTIVITY', undefined, undefined, true, true);
            break;
        }
        case 'Transaction': {
            if (line.getParent(tags)?.tag === 'Spawn') {
                list = await intellisenseCache.loadTransactionList();
            }
            break;
        }
        case 'Name': {
            const grandParent = line.getParent(tags)?.getParent(tags);
            const grandGrandParent = grandParent?.getParent(tags);
            if (grandParent?.tag === 'MathAndFields') {
                const trans = await intellisenseCache.loadRule(
                    intellisenseCache.getRelatedTransactionGUID(),
                    true,
                    false,
                );
                trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv)));
            }
            if (grandGrandParent?.tag === 'ConfirmationScreen') {
                const trans = await intellisenseCache.loadRule(
                    intellisenseCache.getRelatedTransactionGUID(),
                    true,
                    false,
                );
                trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv)));
                trans.fields?.forEach((f) => tryInsert(list, f.name));
            }
            if (grandGrandParent?.tag === 'CreateSegment') {
                list = await getSegmentFields();
            }

            break;
        }
        case 'ClientGUID': {
            const trans = await intellisenseCache.loadRule(intellisenseCache.getRelatedTransactionGUID(), true, false);
            trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv, 'TEXT')));
            break;
        }
        case 'Rule': {
            const rules = await intellisenseCache.loadAttachedRulesList();
            list = rules.filter(
                (r) =>
                    ![
                        'ActivitySummary',
                        'ConfirmationScreen',
                        'CopyToScheduledValuationFields',
                        'DisbursementNumber',
                        'FundListForAllocation',
                        'GenerateDocument',
                        'QuoteScreen',
                        'TransactionBusinessRulePacket',
                        'TransactionCosmetics',
                        'VerificationScreen',
                    ].includes(r),
            );
            break;
        }
    }
    return list.map((l) => {
        return {
            label: l,
            kind: languages.CompletionItemKind.Reference,
            detail: l,
            insertText: l,
            range,
        };
    });
};

export const getActionVariablesAutocomplete = async (tags: TokenTag[], datatype?: string) => {
    if (!datatype) {
        const list1 = await getFields(tags);
        const list2 = await getMathVariables(tags, undefined, 'Actions');
        return list1.concat(list2).concat('PolicyGUID').sort();
    } else {
        return (await getMathVariables(tags, datatype, 'Actions')).sort();
    }
};

const suggestSQLKeywords = () => {
    return ['<SQL placeholder>'];
};
