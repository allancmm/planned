import { IRange, languages } from 'monaco-editor';
import { getActionVariablesAutocomplete } from './contentIntellisense';
import { getFields } from './utils/fieldsUtils';
import { intellisenseCache } from './utils/intellisense';
import { getMathVariables, listIDs, mvIsCorrectDataType, tryInsert } from './utils/intellisenseUtils';
import { TokenTag } from './utils/parsingUtils';
import { allDatatypes, getBuiltInFunctionsList, methods, mvTypes } from './utils/schema';

export const suggestMathVariableValues = async (
    line: TokenTag,
    tags: TokenTag[],
    currentAttribute: string,
    wrap: boolean,
    range: IRange,
): Promise<languages.CompletionItem[]> => {
    let list: string[] = [];
    let additionalText: string[] = [];
    const math = tags.find((t) => t.tag === 'Math');
    const mathID = math?.getAttribute('ID')?.value;
    const mainTag = math?.getParent(tags);

    switch (currentAttribute) {
        case 'TYPE': {
            list = mvTypes;
            if (!line.getAttribute('DATATYPE')) {
                additionalText = list.map(getMvTypeEnd);
            }
            break;
        }
        case 'METHOD': {
            list = methods;
            break;
        }
        case 'DATATYPE': {
            list = completeDatatype(line);
            break;
        }
        case 'INDEX': {
            list = await getMathVariables(tags, 'INTEGER', mainTag?.tag, mathID, true);
            break;
        }
        case 'SEGMENTGUID': {
            list = await getMathVariables(tags, 'TEXT', mainTag?.tag, mathID, true);
            break;
        }
        case 'KEY': {
            if (line.getAttribute('TYPE')?.value === 'COLLECTION') {
                list = await getMathVariables(tags, undefined, mainTag?.tag, mathID, true);
            }
            break;
        }
        case 'KEYFIELD': {
            if (line.getAttribute('TYPE')?.value === 'COLLECTIONVALUE') {
                list = await getMathVariables(tags, undefined, mainTag?.tag, mathID, true);
            }
            break;
        }
        case 'OPERATION': {
            const mvType = line.getAttribute('TYPE')?.value ?? '';
            if (mvType === 'COLLECTION' || mvType === 'ACTIVITY') {
                list = ['CREATE', 'SETVALUE'];
            }
            if (mvType.includes('ARRAY')) {
                list = ['CREATE', 'APPEND', 'COPY', 'FILLBY-SQL'];
                additionalText = list.map((l) => getMvArrayOperationEnd(line, l));
            }
            break;
        }
        case 'LOG': {
            list = ['Yes', 'No'];
            break;
        }
        case 'SOURCEARRAY': {
            const mvType = line.getAttribute('TYPE')?.value ?? '';
            if (mvType.includes('ARRAY')) {
                const mvOperation = line.getAttribute('OPERATION')?.value;

                if (mvOperation === 'APPEND') {
                    const mvName = line.getAttribute('VARIABLENAME')?.value;
                    list = mvName ? [mvName] : [];
                }
                if (mvOperation === 'COPY') {
                    const mvDatatype = line.getAttribute('DATATYPE')?.value;
                    list = await getMathVariables(tags, mvDatatype, mainTag?.tag, mathID, true, true);
                }
            } else if (mvType === 'LOOPINDEX') {
                list = []; // TODO (nice to have) return mathloops here
            }
            break;
        }
        case 'MULTIFIELD': {
            list = listIDs(tags, 'Multifields', 'RULE');
            break;
        }
    }
    return list.map((l, i) => {
        const text = additionalText[i] ?? '';
        return {
            label: l,
            kind: languages.CompletionItemKind.Value,
            detail: l + '\n' + (wrap ? `"${l}"${text}` : l + text),
            insertText: wrap ? `"${l}"${text}` : l + text,
            range,
        };
    });
};

export const suggestActionAttributesValues = async (
    line: TokenTag,
    tags: TokenTag[],
    currentAttribute: string,
    wrap: boolean,
    range: IRange,
): Promise<languages.CompletionItem[]> => {
    let list: string[] = [];
    let actionTag = tags[0].getParent(tags);

    while (actionTag?.tag === 'Condition' || actionTag?.tag === 'Else' || actionTag?.tag === 'ElseIf') {
        const parent = actionTag.getParent(tags);
        if (parent) {
            actionTag = parent;
        } else {
            break;
        }
    }

    // Create list
    switch (currentAttribute) {
        case 'ACTIONTYPE':
            if (actionTag?.tag === 'ActionSet') {
                list = [
                    'CALLEXTERNALEVENT',
                    'ERROR',
                    'WARNING',
                    'SHOW',
                    'HIDE',
                    'ENABLE',
                    'DISABLE',
                    'DISABLEALL',
                    'ENABLEALL',
                    'READONLY',
                    'ASSIGN',
                ];
            } else if (actionTag?.tag === 'QuerySet') {
                list = [
                    'SQLQUERY',
                    'MATHCOLLECTION',
                    'CALLEXTERNALEVENT',
                    'ERROR',
                    'WARNING',
                    'SHOW',
                    'HIDE',
                    'ENABLE',
                    'DISABLE',
                    'DISABLEALL',
                    'ENABLEALL',
                    'READONLY',
                    'ASSIGN',
                ];
            }
            break;
        case 'FIELD':
            if (!line.getAttribute('MULTIFIELD')) {
                list = await getFields(tags);
            } else {
                const multifield = line.getAttribute('MULTIFIELD')?.value;
                if (multifield) {
                    const rule = await intellisenseCache.loadRule(multifield);
                    list = rule.fields?.map((f) => f.name) ?? [];
                }
            }
            break;
        case 'MULTIFIELD':
            list = listIDs(tags, 'Multifields', 'RULE');
            break;
    }

    return list.map((l) => {
        return {
            label: l,
            kind: languages.CompletionItemKind.Value,
            detail: l,
            insertText: wrap ? `"${l}"` : l,
            range,
        };
    });
};

export const suggestAttributeValuesOverrides = async (
    line: TokenTag,
    tags: TokenTag[],
    currentAttribute: string,
    wrap: boolean,
    range: IRange,
): Promise<languages.CompletionItem[]> => {
    let list: string[] = [];
    let additionalText: string[] = [];
    const contextTag: TokenTag | undefined = line.getParent(tags);

    if (currentAttribute === 'ID') {
        if (contextTag?.tag === 'Event') {
            if (line.tag === 'Math') {
                list = listIDs(tags, line.tag, 'ID', 'ScreenMath');
            } else if (line.tag === 'ActionSet' || line.tag === 'QuerySet') {
                list = listIDs(tags, line.tag, 'ID', 'Actions');
            }
        } else if (contextTag?.tag === 'Actions') {
            const eventList = listIDs(tags, line.tag, 'ID', 'Events');
            const actionList = listIDs(tags, line.tag, 'ID', 'Actions');
            eventList.forEach((id) => {
                tryInsert(list, id);
            });
            actionList.forEach((id) => {
                tryInsert(list, id);
            });
        } else if (contextTag?.tag === 'ScreenMath') {
            const eventList = listIDs(tags, line.tag, 'ID', 'Events');
            const screenMathList = listIDs(tags, line.tag, 'ID', 'ScreenMath');
            eventList.forEach((id) => {
                tryInsert(list, id);
            });
            screenMathList.forEach((id) => {
                tryInsert(list, id);
            });
        }
    }

    if (currentAttribute === 'FIELD') {
        if (line.tag === 'Action' || line.tag === 'Event' || line.tag === 'QuerySet') {
            list = await getFields(tags);
        } else if (line.tag === 'Transaction') {
            list = await getMathVariables(tags, 'DATE');
        }
    }

    if (currentAttribute === 'FUNCTIONNAME') {
        const datatype = line.getAttribute('DATATYPE')?.value ?? '';
        list = await intellisenseCache.loadFunctionList();
        if (!datatype) {
            additionalText = await Promise.all(list.map(getFunctionAutoComplete));
        }
    }
    if (currentAttribute === 'RULE' && line.tag === 'Multifields') {
        list = await intellisenseCache.loadMultiFieldsList();
    }

    if (
        (line.tag === 'Role' && currentAttribute !== 'ROLEPERCENT') ||
        (line.tag === 'CopyToAddressFields' && currentAttribute === 'ADDRESSGUID') ||
        (line.tag === 'CopyToSegmentFields' && currentAttribute === 'SEGMENTGUID') ||
        (line.tag === 'CopyToClientFields' && currentAttribute === 'CLIENTGUID') ||
        (line.tag === 'PolicyRole' && currentAttribute === 'ROLECODE') ||
        (line.tag === 'Activity' && currentAttribute === 'ACTIVITYGUID')
    ) {
        const rule = await intellisenseCache.loadRule(intellisenseCache.getRelatedTransactionGUID(), true, false);
        rule.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv, 'TEXT')));
        rule.fields?.forEach((f) => tryInsert(list, `Activity:${f.name}`, f.dataType === 'TEXT'));
    }
    if (line.tag === 'Role' && currentAttribute === 'ROLEPERCENT') {
        const rule = await intellisenseCache.loadRule(intellisenseCache.getRelatedTransactionGUID(), true, false);
        rule.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv, 'DECIMAL')));
        rule.fields?.forEach((f) => tryInsert(list, `Activity:${f.name}`, f.dataType === 'DECIMAL'));
    }

    if (currentAttribute === 'TOOLTIP') {
        if (line.tag === 'AmountField' || line.tag === 'DetailField') {
            const rule = await intellisenseCache.loadRule(intellisenseCache.getRelatedTransactionGUID(), true, false);
            rule.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv, 'TEXT')));
        }
    }

    if (currentAttribute === 'PLAN' && line.tag === 'Policy') {
        list = await intellisenseCache.loadPlanList();
    }
    if (currentAttribute === 'SEGMENTNAME') {
        if (line.tag === 'Segment' || line.tag === 'CreateSegment') {
            list = await intellisenseCache.loadSegmentNameList();
        }
    }
    if (currentAttribute === 'COPYSOURCE') {
        if (line.tag === 'Role' || line.tag === 'Policy' || line.tag === 'Segment') {
            list = ['Yes', 'No'];
        }
    }
    if ((line.tag === 'Rule' || line.tag === 'MathIf' || line.tag === 'MathVariable') && currentAttribute === 'IF') {
        const trans = await intellisenseCache.loadRule(intellisenseCache.getRelatedTransactionGUID(), true, false);
        trans.mathVariables?.forEach((mv) => tryInsert(list, mv.name, mvIsCorrectDataType(mv)));
        list = list.concat(getBuiltInFunctionsList()).sort();
    }

    if ((line.tag === 'Condition' || line.tag === 'ElseIf') && currentAttribute === 'IF') {
        list = await getActionVariablesAutocomplete(tags);
    }

    return list.map((l, i) => {
        const text = additionalText[i] ?? '';
        return {
            label: l,
            kind: languages.CompletionItemKind.Value,
            detail: l + '\n' + (wrap ? `"${l}"${text}` : l + text),
            insertText: wrap ? `"${l}"${text}` : l + text,
            range,
        };
    });
};

const completeDatatype = (line: TokenTag) => {
    let list: string[] = [];
    switch (line.getAttribute('TYPE')?.value) {
        case 'AGGREGATEFUNCTION':
            const mvMethod = line.getAttribute('METHOD')?.value;
            switch (mvMethod) {
                case 'COUNT':
                    list = ['INTEGER'];
                    break;
                case 'SUM':
                    list = ['DECIMAL', 'INTEGER'];
                    break;
                case 'MIN':
                    list = ['DECIMAL', 'INTEGER'];
                    break;
                case 'MAX':
                    list = ['DECIMAL', 'INTEGER'];
                    break;
                case 'INDEX':
                    list = ['DECIMAL', 'INTEGER', 'TEXT', 'DATE'];
                    break;
            }
            break;
        case 'COLLECTION':
            switch (line.getAttribute('OPERATION')?.value) {
                case 'CREATE':
                    list = ['MAP'];
                    break;
                case 'SETVALUE':
                    list = allDatatypes;
                    break;
                case undefined:
                    list = ['MAP'];
                    break;
            }
            break;
        case 'ACTIVITY':
            switch (line.getAttribute('OPERATION')?.value) {
                case 'CREATE':
                    list = ['ACTIVITY'];
                    break;
                case 'SETVALUE':
                    list = allDatatypes;
                    break;
            }
            break;
        case 'COLLECTIONVALUE':
            list = allDatatypes;
            break;
        case 'DATEARRAY':
            list = ['DATE'];
            break;
        case 'TEXTARRAY':
            list = ['TEXT'];
            break;
        case 'STRINGARRAY':
            list = ['TEXT'];
            break;
        case 'ACTIVITYARRAY':
            list = ['ACTIVITY'];
            break;
        case 'NUMERICARRAY':
            list = ['DECIMAL', 'INTEGER'];
            break;
        case 'VALUE':
            list = ['TEXT', 'BIGTEXT', 'DECIMAL', 'INTEGER', 'DATE', 'CURRENCY', 'XML', 'BOOLEAN'];
            break;
        case 'EXPRESSION':
        case 'FUNCTION':
        case 'FUNCTIONCALL':
            list = allDatatypes;
            break;
        case 'LOOPINDEX':
            list = ['INTEGER'];
            break;
        case 'SQL':
            list = ['TEXT', 'BIGTEXT', 'DECIMAL', 'INTEGER', 'DATE', 'CURRENCY', 'XML', 'BOOLEAN'];
            break;
        case 'FIELD':
        case 'POLICYFIELD':
        case 'SUSPENSEFIELD':
        case 'SEGMENTFIELD':
        case 'MULTIFIELD':
            list = ['TEXT', 'BIGTEXT', 'DECIMAL', 'INTEGER', 'DATE', 'CURRENCY'];
            break;
        case 'XML':
            list = ['TEXT', 'BIGTEXT', 'DECIMAL', 'INTEGER', 'DATE', 'CURRENCY', 'XML', 'BOOLEAN'];
            break;
    }
    return list;
};

const getMvTypeEnd = (mvType: string) => {
    let returnText = '';
    switch (mvType) {
        case 'TEXTARRAY':
        case 'STRINGARRAY':
            returnText = ' DATATYPE="TEXT"';
            break;
        case 'ACTIVITYARRAY':
            returnText = ' DATATYPE="ACTIVITY"';
            break;
        case 'DATEARRAY':
        case 'SYSTEMDATE':
            returnText = ' DATATYPE="DATE"';
            break;
        case 'SEGMENT':
            returnText = ' POLICY="[Policy:PolicyGUID]"';
            break;
    }
    return returnText;
};

const getMvArrayOperationEnd = (line: TokenTag, mvOperation: string) => {
    switch (mvOperation) {
        case 'CREATE':
            return '>0</MathVariable>';
        case 'APPEND':
            const mvName = line.getAttribute('VARIABLENAME')?.value;
            if (!line.getAttribute('SOURCEARRAY')?.value) {
                return ' SOURCEARRAY="' + mvName + '"';
            }
            break;
    }
    return '';
};

const getFunctionAutoComplete = async (functionName: string): Promise<string> => {
    const f = await intellisenseCache.loadRule(functionName);
    return ` DATATYPE="${f.functionDataType}">\n${f.parameters?.map(
        (p) => `<Parameter NAME="${p.name}">${p.type}</Parameter>`,
    )}\n</MathVariable>`;
};
