import { editor, IRange, languages } from 'monaco-editor';
import { intellisenseCache } from '../utils/intellisense';

export const SMART_SNIPPET_CHAR = '$';
export const SEPARATOR_SMART_CHAR = ':';

export const SMART_CATEGORIES = ['Function', 'CopyBook'];
type SmartCategory = typeof SMART_CATEGORIES[number];

export const suggestSmartSnippets = async (currentWord: string, range: IRange): Promise<languages.CompletionItem[]> => {
    const word = currentWord.substring(2); // removes the smart_char and the first separator

    const wordParts = word.split(SEPARATOR_SMART_CHAR);
    const firstLevel: SmartCategory = wordParts[0];

    const overrideAction = intellisenseCache
        .getCurrentActions()
        .filter((a) => a.id.includes(OVERRIDE_INSERT_ACTION.id))[0]; // monaco inserts it's own prefix and this API doesn't do it /shrug

    switch (firstLevel) {
        case 'Function':
            const functions = await intellisenseCache.loadFunctionList();
            return functions.map((f) => ({
                label: rebuildWord(1, wordParts, f),
                kind: languages.CompletionItemKind.Function,
                detail: f,
                insertText: '',
                range,
                command: {
                    id: overrideAction.id,
                    title: '123',
                    arguments: [
                        (e: editor.ICodeEditor) =>
                            intellisenseCache.fetchFunctionDeclaration(f, e.getModel()?.id ?? ''),
                    ] as any[],
                },
            }));
            
            case 'CopyBook':
                const copyBooks = await intellisenseCache.loadCopyBookList();
                return copyBooks.map((c) => ({
                    label: rebuildWord(1, wordParts, c),
                    kind: languages.CompletionItemKind.Field,
                    detail: c,
                    insertText: '',
                    range,
                    command: {
                        id: overrideAction.id,
                        title: '123',
                        arguments: [
                            (e: editor.ICodeEditor) => 
                                intellisenseCache.fetchCopyBookDeclaration(c, e.getModel()?.id ?? ''),
                        ] as any[],
                    },
                }));
        default:
            return Promise.resolve(
                SMART_CATEGORIES.map((s) => ({
                    label: rebuildWord(0, wordParts, s),
                    kind: languages.CompletionItemKind.Function,
                    detail: 'Smart snippets that will provide full function-call declaration',
                    insertText: rebuildWord(0, wordParts, s + SEPARATOR_SMART_CHAR),
                    range,
                    command: TRIGGER_SUGGESTIONS_COMMAND,
                })),
            );
    }
};

const rebuildWord = (level: number, wordParts: string[], addTo: string) => {
    let word = SMART_SNIPPET_CHAR;
    for (let i = 0; i < level; i++) {
        word += SEPARATOR_SMART_CHAR + wordParts[i];
    }
    return word + SEPARATOR_SMART_CHAR + addTo;
};

export const TRIGGER_SUGGESTIONS_COMMAND: languages.Command = { id: 'editor.action.triggerSuggest', title: '123' };
export const OVERRIDE_INSERT_ACTION: editor.IActionDescriptor = {
    id: 'load-text-async',
    label: '', // leave empty so it doesn't show up in command palette
    run: async (e: editor.ICodeEditor, fetchEdit: (e: editor.ICodeEditor) => Promise<string>) => {
        const text = await fetchEdit(e);
        const contribution: any = e.getContribution('snippetController2');
        contribution.insert(text); // unofficial API, insert DOES exists, hence the any
    },
};
