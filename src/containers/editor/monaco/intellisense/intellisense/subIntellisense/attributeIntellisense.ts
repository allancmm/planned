import { languages, IRange } from 'monaco-editor';
import { TokenTag } from './utils/parsingUtils';

export const suggestMathVariableAttributes = (line: TokenTag, range: IRange): languages.CompletionItem[] => {
    const suggestions: languages.CompletionItem[] = [];
    if (!line.getAttribute('VARIABLENAME')) {
        suggestions.push({
            label: 'VARIABLENAME',
            kind: languages.CompletionItemKind.Property,
            detail: 'VARIABLENAME',
            insertText: 'VARIABLENAME',
            preselect: true,
            range,
        });
    } else if (!line.getAttribute('TYPE')) {
        suggestions.push({
            label: 'TYPE',
            kind: languages.CompletionItemKind.Property,
            detail: 'TYPE',
            insertText: 'TYPE',
            preselect: true,
            range,
        });
    }
    suggestions.push(
        ...suggestAfterType(line).map(s => ({
            label: s,
            kind: languages.CompletionItemKind.Property,
            detail: s,
            insertText: s,
            range,
        })),
    );
    return suggestions;
};

const suggestAfterType = (line: TokenTag) => {
    const mvType = line.getAttribute('TYPE')?.value ?? '';
    let list: string[] = [];
    switch (mvType) {
        case 'TEXTARRAY':
        case 'STRINGARRAY':
        case 'DATEARRAY':
        case 'NUMERICARRAY':
        case 'ACTIVITYARRAY':
        case 'VALUE':
        case 'SUSPENSEFIELD':
        case 'EXPRESSION':
        case 'FIELD':
        case 'POLICYFIELD':
        case 'SQL':
        case 'FUNCTION':
            list = line.getAttribute('DATATYPE') ? getAttributeAfterDatatype(line, mvType) : ['DATATYPE'];
            break;
        case 'SYSTEMDATE':
            if (!line.getAttribute('DATATYPE')) {
                list = ['DATATYPE'];
            }
            break;
        case 'COLLECTIONVALUE':
            if (!line.getAttribute('KEY') && !line.getAttribute('KEYFIELD')) {
                list = ['KEY', 'KEYFIELD'];
            } else {
                if (!line.getAttribute('DATATYPE')) {
                    list = ['DATATYPE'];
                } else {
                    if (!line.getAttribute('LOG')) {
                        list.push('LOG');
                    }
                    if (!line.getAttribute('DEFAULT')) {
                        list.push('DEFAULT');
                    }
                    if (line.getAttribute('DATATYPE')?.value === 'DECIMAL' && !line.getAttribute('ROUND')) {
                        list.push('ROUND');
                    }
                }
            }

            break;
        case 'COLLECTION':
            list = line.getAttribute('OPERATION') ? getAfterOperationAttr(line, 'KEY') : ['OPERATION', 'DATATYPE'];
            break;
        case 'ACTIVITY':
            list = line.getAttribute('OPERATION') ? getAfterOperationAttr(line, 'FIELDNAME') : ['OPERATION'];
            break;
        case 'MULTIFIELD':
            if (!line.getAttribute('MULTIFIELD')) {
                list = ['MULTIFIELD'];
            } else if (!line.getAttribute('INDEX')) {
                list = ['INDEX'];
            } else if (!line.getAttribute('DATATYPE')) {
                list = ['DATATYPE'];
            } else {
                if (!line.getAttribute('LOG')) {
                    list.push('LOG');
                }
                if (!line.getAttribute('DEFAULT')) {
                    list.push('DEFAULT');
                }
                if (line.getAttribute('DATATYPE')?.value === 'DECIMAL' && !line.getAttribute('ROUND')) {
                    list.push('ROUND');
                }
            }
            break;
        case 'FUNCTIONCALL':
            if (!line.getAttribute('FUNCTIONNAME')) {
                list = ['FUNCTIONNAME'];
            } else if (!line.getAttribute('DATATYPE')) {
                list = ['DATATYPE'];
            }
            break;
        case 'AGGREGATEFUNCTION':
            if (!line.getAttribute('METHOD')) {
                list = ['METHOD'];
            } else {
                list = getAfterMethodAttr(line);
            }
            break;

        case 'LOOPINDEX':
            if (!line.getAttribute('SOURCEARRAY')) {
                list = ['SOURCEARRAY'];
            } else {
                if (!line.getAttribute('DATATYPE')) {
                    list = ['DATATYPE'];
                }
            }
            break;
        case 'SEGMENT':
            if (!line.getAttribute('POLICY')) {
                list = ['POLICY'];
            } else {
                if (!line.getAttribute('CONDITION')) {
                    list = ['CONDITION'];
                }
            }
            break;
        case 'FOR':
            if (!line.getAttribute('ITERATIONS')) {
                list = ['ITERATIONS'];
            }
            break;
        case 'OBJECTLOOP':
            if (!line.getAttribute('ITERATIONS')) {
                list = ['ITERATIONS'];
            }
            if (!line.getAttribute('OBJECTNAME')) {
                list = ['OBJECTNAME'];
            } else {
                if (!line.getAttribute('CONDITION')) {
                    list = ['CONDITION'];
                } else {
                    if (!line.getAttribute('KEY')) {
                        list = ['KEY'];
                    }
                }
            }
            break;
        case 'EXIT-LOOP':
            if (!line.getAttribute('IF')) {
                list = ['IF'];
            }
            break;
        case 'XML':
            if (!line.getAttribute('XPATH')) {
                list = ['XPATH'];
            } else if (!line.getAttribute('DATATYPE')) {
                list = ['DATATYPE'];
            }
            break;
        case 'SEGMENTFIELD':
            if (!line.getAttribute('SEGMENTGUID') && !line.getAttribute('SOURCEARRAY')) {
                list = ['SEGMENTGUID', 'SOURCEARRAY'];
            } else if (!line.getAttribute('DATATYPE')) {
                list = ['DATATYPE'];
            }
            break;
    }

    return list;
};

export const suggestActionsAttributes = (line: TokenTag, range: IRange): languages.CompletionItem[] => {
    const list: string[] = [];
    if (!line.getAttribute('ACTIONTYPE')) {
        list.push('ACTIONTYPE');
    } else {
        const actionType = line.getAttribute('ACTIONTYPE')?.value;
        switch (actionType) {
            case 'CALLEXTERNALEVENT':
                if (!line.getAttribute('ID')) {
                    list.push('ID');
                }
                break;
            case 'SHOW':
            case 'HIDE':
            case 'ENABLE':
            case 'DISABLE':
            case 'READONLY':
            case 'ASSIGN':
                if (!line.getAttribute('MULTIFIELD')) {
                    list.push('MULTIFIELD');
                }
                if (!line.getAttribute('FIELD')) {
                    list.push('FIELD');
                }
                if (line.getAttribute('MULTIFIELD') && line.getAttribute('FIELD') && !line.getAttribute('INDEX')) {
                    list.push('INDEX');
                }
                break;
        }
    }
    return list.map(s => ({
        label: s,
        kind: languages.CompletionItemKind.Property,
        detail: s,
        insertText: s,
        range,
    }));
};

const getAttributeAfterDatatype = (line: TokenTag, mvType: string) => {
    let list: string[] = [];
    switch (mvType) {
        case 'SUSPENSEFIELD':
            list = ['DEFAULT'];
            break;
        case 'VALUE':
            if (!line.getAttribute('LOG')) {
                list.push('LOG');
            }
            if (line.getAttribute('DATATYPE')?.value === 'CURRENCY' && !line.getAttribute('CURRENCYCODE')) {
                list.push('CURRENCYCODE');
            }
            break;
        case 'FUNCTION':
            if (!line.getAttribute('LOG')) {
                list.push('LOG');
            }
            if (line.getAttribute('DATATYPE')?.value === 'DECIMAL' && !line.getAttribute('ROUND')) {
                list.push('ROUND');
            }
            break;
        case 'EXPRESSION':
        case 'FIELD':
        case 'POLICYFIELD':
        case 'SQL':
            if (!line.getAttribute('LOG')) {
                list.push('LOG');
            }
            if (!line.getAttribute('DEFAULT')) {
                list.push('DEFAULT');
            }
            if (line.getAttribute('DATATYPE')?.value === 'DECIMAL' && !line.getAttribute('ROUND')) {
                list.push('ROUND');
            }
            break;
        case 'TEXTARRAY':
        case 'STRINGARRAY':
        case 'DATEARRAY':
        case 'NUMERICARRAY':
        case 'ACTIVITYARRAY':
            if (!line.getAttribute('OPERATION')) {
                list.push('OPERATION');
            } else {
                switch (line.getAttribute('OPERATION')?.value ?? '') {
                    case 'COPY':
                    case 'APPEND':
                        if (!line.getAttribute('SOURCEARRAY')) {
                            list.push('SOURCEARRAY');
                        }
                        break;
                }
            }
            break;
        case 'MULTIFIELD':
        case 'FUNCTIONCALL':
        case 'LOOPINDEX':
        case 'SEGMENT':
        case 'FOR':
        case 'OBJECTLOOP':
        case 'EXIT-LOOP':
        case 'SYSTEMDATE':
            break;
    }

    return list;
};

const getAfterOperationAttr = (line: TokenTag, keyAttr: string) => {
    const mvOperation = line.getAttribute('OPERATION')?.value;
    if (mvOperation === 'CREATE') {
        if (!line.getAttribute('DATATYPE')) {
            return ['DATATYPE'];
        }
    }
    if (mvOperation === 'SETVALUE') {
        if (!line.getAttribute(keyAttr)) {
            return [keyAttr];
        } else {
            if (!line.getAttribute('DATATYPE')) {
                return ['DATATYPE'];
            } else {
                const list = [];
                if (!line.getAttribute('LOG')) {
                    list.push('LOG');
                }
                if (line.getAttribute('DATATYPE')?.value === 'DECIMAL' && !line.getAttribute('ROUND')) {
                    list.push('ROUND');
                }
                return list;
            }
        }
    }
    return [];
};

const getAfterMethodAttr = (line: TokenTag) => {
    const mvMethod = line.getAttribute('METHOD')?.value;
    if (mvMethod === 'INDEX') {
        if (!line.getAttribute('INDEX')) {
            return ['INDEX'];
        } else if (!line.getAttribute('DATATYPE')) {
            return ['DATATYPE'];
        }
    } else {
        if (!line.getAttribute('DATATYPE')) {
            return ['DATATYPE'];
        } else {
            const list = [];
            if (!line.getAttribute('LOG')) {
                list.push('LOG');
            }
            if (line.getAttribute('DATATYPE')?.value === 'DECIMAL' && !line.getAttribute('ROUND')) {
                list.push('ROUND');
            }
            return list;
        }
    }

    return [];
};
