import { IRange, languages } from 'monaco-editor';
import { ContextSnippets } from './snippets/contextSnippets';
import { HotKeysSnippets } from './snippets/hotkeysSnippets';
import { SEPARATOR_SMART_CHAR, SMART_SNIPPET_CHAR, TRIGGER_SUGGESTIONS_COMMAND } from './snippets/smartSnippets';
import { intellisenseCache } from './utils/intellisense';
import { TokenTag } from './utils/parsingUtils';

export const suggestContextSnippets = async (
    tags: TokenTag[],
    range: IRange,
    parentLine?: TokenTag,
): Promise<languages.CompletionItem[]> => {
    const suggestions: languages.CompletionItem[] = [];

    if (parentLine) {
        const grandParent = parentLine.getParent(tags);

        const snippets = ContextSnippets[parentLine.tag]
            ?.filter((s) => !s.grandParentTag || s.grandParentTag === grandParent?.tag)
            ?.map((s) => ({
                label: s.name,
                kind: languages.CompletionItemKind.Enum,
                detail: s.details + '\n' + s.snippet,
                insertText: s.snippet,
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: range,
            }));

        if (snippets) suggestions.push(...snippets);

        const contextCustomSnippet = await intellisenseCache.getSnippets().then((snip) =>
            snip
                .filter((s) => s.parentTag === parentLine.tag)
                .filter((s) => !s.grandParentTag || s.grandParentTag === grandParent?.tag)
                .map((s) => ({
                    label: s.name,
                    kind: languages.CompletionItemKind.Enum,
                    detail: s.details + '\n' + s.snippet,
                    insertText: s.snippet,
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range: range,
                })),
        );
        suggestions.push(...contextCustomSnippet);
    }

    return suggestions;
};

export const suggestHotKeysSnippets = async (range: IRange): Promise<languages.CompletionItem[]> => {
    const hotKeysCustomSnippet = await intellisenseCache.getSnippets().then((snip) =>
        snip
            .filter((s) => !s.parentTag)
            .map((s) => ({
                label: s.name,
                kind: languages.CompletionItemKind.Snippet,
                detail: s.details + '\n' + s.snippet,
                insertText: s.snippet,
                insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range,
            })),
    );
    const defaultHotKeys = HotKeysSnippets.map((s) => ({
        label: s.hotkeys,
        kind: languages.CompletionItemKind.Snippet,
        detail: s.details + '\n' + s.snippet,
        insertText: s.snippet,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
    }));
    const smartSnippet = {
        label: SMART_SNIPPET_CHAR + ' (smart snippets)',
        kind: languages.CompletionItemKind.Function,
        detail: 'Use smart snippets',
        insertText: SMART_SNIPPET_CHAR + SEPARATOR_SMART_CHAR,
        range,
        command: TRIGGER_SUGGESTIONS_COMMAND,
    };
    return [smartSnippet, ...hotKeysCustomSnippet, ...defaultHotKeys];
};
