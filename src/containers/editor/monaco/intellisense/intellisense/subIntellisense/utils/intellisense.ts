import { editor, languages } from 'monaco-editor';
import { toast } from 'react-toastify';
import { defaultIntellisenseRepository } from '../../../../../../../lib/context';
import Snippet from '../../../../../../../lib/domain/entities/intellisense/snippet';
import { EntityType } from '../../../../../../../lib/domain/enums/entityType';
import intellisenseProvider from '../../intellisenseProvider';
import semanticsProvider, { semanticsTokenRules } from './semanticProvider';
import { formatXML } from './xmlPrettier';

export class IntellisenseCache {
    private currentRuleGuid: { [key: string]: string } = {};
    private currentEntityType: { [key: string]: EntityType } = {};
    private relatedTransactionGUID: { [key: string]: string } = {};
    private actions: { [name: string]: editor.IActionDescriptor[] } = {};

    private rules: { [name: string]: ExternalRuleCache } = {};
    private lists: { [name: string]: string[] } = {};
    private snippets?: Snippet[];
    private currentModelId?: string;

    init = async (modelID: string, ruleGuid: string, entityType: EntityType) => {
        const initData: InitIntellisenseDataDto = await defaultIntellisenseRepository.initData(ruleGuid);
        this.currentRuleGuid[modelID] = ruleGuid;
        this.currentEntityType[modelID] = entityType;
        this.relatedTransactionGUID[modelID] = initData.relatedTransactionGuid;
        this.snippets = await defaultIntellisenseRepository.getSnippets();
    };

    destroy = (modelID: string) => {
        delete this.relatedTransactionGUID[modelID];
        delete this.currentRuleGuid[modelID];
        delete this.currentEntityType[modelID];
        delete this.actions[modelID];
    };

    start = (modelId: string) => {
        this.currentModelId = modelId;
    };

    finish = () => {
        this.currentModelId = undefined;
    };

    getRelatedTransactionGUID = () => {
        return this.currentModelId ? this.relatedTransactionGUID[this.currentModelId] : '';
    };

    getCurrentActions = () => {
        return this.currentModelId ? this.actions[this.currentModelId] : [];
    };

    setActions = (modelId: string, actions: editor.IEditorAction[]) => {
        this.actions[modelId] = actions;
    };

    getCurrentRuleGuid = () => {
        return this.currentModelId ? this.currentRuleGuid[this.currentModelId] : '';
    };

    getCurrentEntityType = () => {
        return this.currentModelId ? this.currentEntityType[this.currentModelId] : '';
    };

    loadRule = async (
        ruleName: string,
        isTransaction: boolean = false,
        byName: boolean = true,
    ): Promise<ExternalRuleCache> => {
        if (!this.rules[ruleName]) {
            // do load
            let imported;
            try {
                imported = await defaultIntellisenseRepository.loadRule(ruleName, isTransaction, byName);
            } catch (error) {
                toast(`Error while fetching content of rule ${ruleName}`);
                imported = {};
            }
            this.rules[ruleName] = imported;
        }
        return this.rules[ruleName];
    };

    placeholder = (tag: string) => {
        tag.includes('test');
    };

    loadMultiFieldsList = async (): Promise<string[]> => {
        const multifields = 'MultiFields';
        if (!this.lists[multifields]) {
            this.lists[multifields] = await defaultIntellisenseRepository.loadMultiFieldsList();
        }
        return this.lists[multifields];
    };

    loadSegmentNameList = async (): Promise<string[]> => {
        const segmentName = 'SegmentName';
        if (!this.lists[segmentName]) {
            this.lists[segmentName] = await defaultIntellisenseRepository.loadSegmentNameList();
        }
        return this.lists[segmentName];
    };

    loadPlanList = async (): Promise<string[]> => {
        const plans = 'Plans';
        if (!this.lists[plans]) {
            this.lists[plans] = await defaultIntellisenseRepository.loadPlanList();
        }
        return this.lists[plans];
    };

    loadFunctionList = async (): Promise<string[]> => {
        const functions = `Functions`;
        if (!this.lists[functions]) {
            this.lists[functions] = await defaultIntellisenseRepository.loadFunctionList();
        }
        return this.lists[functions];
    };

    loadTransactionList = async (): Promise<string[]> => {
        const transactions = 'Transactions';
        if (!this.lists[transactions]) {
            this.lists[transactions] = await defaultIntellisenseRepository.loadTransactionList();
        }
        return this.lists[transactions];
    };

    loadCopyBookList = async (): Promise<string[]> => {
        const copyBooks = 'CopyBooks';
        if (!this.lists[copyBooks]) {
            this.lists[copyBooks] = await defaultIntellisenseRepository.loadCopyBookList();
        }
        return this.lists[copyBooks];
    };

    loadAttachedRulesList = async (): Promise<string[]> => {
        const attachedRules = 'AttachedRules';
        if (!this.lists[attachedRules]) {
            this.lists[attachedRules] = this.relatedTransactionGUID
                ? await defaultIntellisenseRepository.loadAttachedRulesList(this.getRelatedTransactionGUID())
                : [];
        }
        return this.lists[attachedRules];
    };

    getSnippets = async (): Promise<Snippet[]> => {
        if (!this.snippets) {
            this.snippets = await defaultIntellisenseRepository.getSnippets();
        }
        return this.snippets;
    };

    // smart snippets
    fetchFunctionDeclaration = async (f: string, modelId: string): Promise<string> => {
        return defaultIntellisenseRepository.loadFunctionDefinition(
            f,
            this.currentRuleGuid[modelId],
            this.currentEntityType[modelId],
        );
    };
    
    fetchCopyBookDeclaration = async (name: string, modelId: string): Promise<string> => {
        if (this.currentRuleGuid[modelId]  && this.currentEntityType[modelId]) {
            return defaultIntellisenseRepository.fetchCopyBookDeclaration(
                name,
                this.currentRuleGuid[modelId],
                this.currentEntityType[modelId],
            );
        }
        return '';
    };
}

export class ExternalRuleCache {
    public fields?: { name: string; dataType: string }[];
    public mathVariables?: MathVariable[];

    public functionDataType?: string;
    public parameters?: { name: string; type: string }[];
}

export class InitIntellisenseDataDto {
    public relatedTransactionGuid: string = '';
}

export interface MathVariable {
    name: string;
    type: string;
    dataType: string;
}

export const intellisenseCache = new IntellisenseCache();
languages.registerDocumentFormattingEditProvider('xml', {
    provideDocumentFormattingEdits: (document: editor.ITextModel): languages.TextEdit[] => {
        return [
            {
                range: document.getFullModelRange(),
                text: formatXML(document.getValue()),
            },
        ];
    },
});

languages.registerCompletionItemProvider('xml', {
    triggerCharacters: ['<', ' ', '=', '"', '/', '[', '(', ',', ':', '$'], // will also trigger on letters
    provideCompletionItems: intellisenseProvider,
});
languages.setLanguageConfiguration('xml', {
    wordPattern: new RegExp(/(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\@\*\(\)\-\=\+\[\{\]\}\\\|\;\'\"\,\.\<\>\/\?\s]+)/g), // default without ':' and '$' (i think, the default is hard to find)
});

languages.registerDocumentSemanticTokensProvider('xml', semanticsProvider);

const COLOR_HIGHLIGHTED_LIGHT = '#C3DCFF';
// add some missing tokens
editor.defineTheme('vs', {
    base: 'vs',
    inherit: true,
    rules: semanticsTokenRules,
    colors: {
        'editor.selectionHighlightBackground': COLOR_HIGHLIGHTED_LIGHT,
    },
});
editor.defineTheme('vs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: semanticsTokenRules,
    colors: {},
});
