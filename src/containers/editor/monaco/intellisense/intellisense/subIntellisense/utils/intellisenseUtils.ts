import { getClientFields, getFields, getPolicyFields } from './fieldsUtils';
import { intellisenseCache, MathVariable } from './intellisense';
import { TokenTag } from './parsingUtils';
import { getBuiltInFunctionsList, iconList } from './schema';

export const listIDs = (tags: TokenTag[], tagName: string, attributeName: string, parentTag?: string): string[] => {
    return tags
        .map((t) => {
            if (t.tag === tagName && (!parentTag || t.getParent(tags)?.tag === parentTag)) {
                return t.getAttribute(attributeName)?.value ?? '';
            }
            return '';
        })
        .filter((t) => t);
};

export const getMathVariables = async (
    tags: TokenTag[],
    filterDataType?: string,
    mainNode?: string,
    currentMathID?: string,
    localOnly: boolean = false,
    isArray: boolean = false,
): Promise<string[]> => {
    const list: string[] = [];
    tags.reverse(); // start from the top

    let inScreenMath = false;
    let mathID: string = '';
    let isGlobal: boolean = false;
    for (const t of tags) {
        if (t.tag.includes('ScreenMath')) {
            inScreenMath = !t.isClosed();
        }

        if (inScreenMath && t.tag === 'Math') {
            mathID = !t.isClosed() ? t.getAttribute('ID')?.value ?? '' : '';
            isGlobal = !t.isClosed() ? t.getAttribute('GLOBAL')?.value === 'Yes' : false;
        }

        if (t.tag === 'CopyBook' && t.content) {
            const rule = await intellisenseCache.loadRule(t.content);
            rule.mathVariables
                ?.map((mv) => mv.name)
                .forEach((mv: string) => {
                    tryInsert(list, mv, !inScreenMath);
                    tryInsert(list, mv, inScreenMath && mainNode === 'ScreenMath' && currentMathID === mathID);
                    tryInsert(
                        list,
                        mathID + ':' + mv,
                        inScreenMath && mainNode === 'ScreenMath' && currentMathID !== mathID && isGlobal && !localOnly,
                    );
                    tryInsert(list, mathID + ':' + mv, inScreenMath && mainNode === 'Actions');
                });
        }

        if (t.tag === 'MathVariable') {
            const dataType = t.getAttribute('DATATYPE')?.value ?? '';
            const type = t.getAttribute('TYPE')?.value ?? '';
            const name = t.getAttribute('VARIABLENAME')?.value ?? '';
            if (mvIsCorrectDataType({ name, dataType, type }, filterDataType ?? '', isArray)) {
                tryInsert(list, name, !inScreenMath);
                tryInsert(list, name, inScreenMath && mainNode === 'ScreenMath' && currentMathID === mathID);
                tryInsert(
                    list,
                    mathID + ':' + name,
                    inScreenMath && mainNode === 'ScreenMath' && currentMathID !== mathID && isGlobal,
                );
                tryInsert(list, mathID + ':' + name, inScreenMath && mainNode === 'Actions');
            }
        }
    }
    tags.reverse();
    return list;
};

export const mvIsCorrectDataType = (mv: MathVariable, filterDataType?: string, isArray: boolean = false) => {
    return (
        (mv.dataType === filterDataType ||
            !filterDataType ||
            (isArray && filterDataType === 'TEXT' && mv.dataType === 'TEXTARRAY') ||
            (isArray && filterDataType === 'INTEGER' && mv.dataType === 'INTEGERARRAY') ||
            (isArray && filterDataType === 'DECIMAL' && mv.dataType === 'DECIMALARRAY') ||
            (isArray && filterDataType === 'DATE' && mv.dataType === 'DATEARRAY')) &&
        (!isArray || mv.type?.includes('ARRAY'))
    );
};

export const tryInsert = (list: string[], name?: string, condition: boolean = true) => {
    if (condition && name && !list.includes(name)) {
        list.push(name);
    }
};

export const getParametersList = (tags: TokenTag[], filterDataType?: string) => {
    const list: string[] = [];
    tags.reverse(); // start from the top

    for (const t of tags) {
        if (t.tag === 'Math' || (t.tag.includes('Parameters') && t.isClosed())) {
            break;
        }

        if (
            t.tag === 'Parameter' &&
            (!filterDataType || t.getAttribute('DATATYPE')?.value === filterDataType) &&
            t.content
        ) {
            list.push(t.content);
        }
    }

    tags.reverse();
    return list;
};

export const getMVExpressionAutocomplete = async (
    tags: TokenTag[],
    datatype?: string,
    mainTag?: TokenTag,
    mathID?: string,
) => {
    let prefixActivity = 'Activity:';
    if (mainTag?.tag === 'ScreenMath') {
        prefixActivity = '';
    }
    const list1 = await getFields(tags, datatype, prefixActivity);
    const list2 = await getMathVariables(tags, datatype, mainTag?.tag, mathID);
    const list3 = getBuiltInFunctionsList(datatype);
    const list4 = getParametersList(tags, datatype);
    if (mainTag?.tag !== 'ScreenMath') {
        const list5 = await getPolicyFields(datatype, 'Policy:');
        const list6 = await getClientFields(datatype, 'Client:');
        return list1.concat(list2.concat(list3.concat(list4.concat(list5.concat(list6))))).sort();
    } else {
        if (!datatype || datatype === 'TEXT') {
            return list1
                .concat(list2.concat(list3.concat(list4)))
                .concat('PolicyGUID')
                .sort();
        } else {
            return list1.concat(list2.concat(list3.concat(list4))).sort();
        }
    }
};

/// Value list ///
export const getValueList = async (line: TokenTag) => {
    switch (line.tag) {
        case 'Disabled':
            return ['Yes', 'No', 'ReadOnly'];
        case 'Hidden':
            return ['Yes', 'No'];
        case 'ClearOnRecycle':
            return ['Yes', 'No'];
        case 'Required':
            return ['Yes', 'No'];
        case 'Final':
            return ['Yes', 'No'];
        case 'Expanded':
            return ['Yes', 'No'];
        case 'Group':
            return ['Math', 'Field'];
        case 'DataType':
            return [
                'Blank',
                'Check',
                'Client',
                'Combo',
                'Date',
                'Decimal',
                'Identifier',
                'Integer',
                'Label',
                'Line',
                'Message',
                'Money',
                'Percent',
                'Radio',
                'Role',
                'Text',
                'TextArea',
                'Title',
            ];
        case 'Icon':
        case 'Button':
        case 'Reverse':
            return iconList;
        case 'CopyBook':
            return intellisenseCache.loadCopyBookList();
        case 'MultiFields':
            return intellisenseCache.loadMultiFieldsList();

        default:
            return [];
    }
};
