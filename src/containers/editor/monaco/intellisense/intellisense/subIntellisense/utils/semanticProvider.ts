import { editor, languages } from 'monaco-editor';

const legend: languages.SemanticTokensLegend = {
    tokenTypes: [
        'Error',
        'ParseErrors',
        'CheckErrors',
        'EvalErrors',
        'UnexpectedError',
        'FunctionCallError',
        'ValidatorErrors',
        'ParamError',
        'InterpreterErrors',
        'XsltError',
        'MessageAndLocation',
        'TransformationMessages',
        'Message',
        'Success',
        'Warning',
    ],
    tokenModifiers: [],
};
export const semanticsTokenRules: editor.ITokenThemeRule[] = [
    { token: 'Error', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'ParseErrors', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'CheckErrors', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'EvalErrors', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'UnexpectedError', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'FunctionCallError', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'ValidatorErrors', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'ParamError', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'InterpreterErrors', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'XsltError', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'MessageAndLocation', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'TransformationMessages', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'Message', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'Success', foreground: '00E000', fontStyle: 'bold' },
    { token: 'Warning', foreground: 'e0d900', fontStyle: 'bold' },
];

const getType = (type: string): number => legend.tokenTypes.indexOf(type);

const getModifier = (modifiers: string[] | string | null): number => {
    if (typeof modifiers === 'string') {
        // tslint:disable-next-line: no-parameter-reassignment
        modifiers = [modifiers];
    }
    if (Array.isArray(modifiers)) {
        let nModifiers = 0;
        for (const modifier of modifiers) {
            const nModifier = legend.tokenModifiers.indexOf(modifier);
            if (nModifier > -1) {
                nModifiers |= (1 << nModifier) >>> 0;
            }
        }
        return nModifiers;
    } else {
        return 0;
    }
};

const tokenPattern = new RegExp('(?<=\\<)/?([a-zA-Z]+)((?: [a-zA-Z0-9="]+)*)(?=\\>)', 'g');

// mostly https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-semantic-tokens-provider-example, regex was modified for xml
// not sure if the whole modifier thing still applies though
const semanticsProvider = {
    getLegend: () => legend,
    provideDocumentSemanticTokens: (
        model: editor.ITextModel,
    ): languages.ProviderResult<languages.SemanticTokens | languages.SemanticTokensEdits> => {
        const lines = model.getLinesContent();

        const data: number[] = [];

        let prevLine = 0;
        let prevChar = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // tslint:disable-next-line: no-conditional-assignment
            for (let match = null; (match = tokenPattern.exec(line)); ) {
                // translate token and modifiers to number representations
                const type = getType(match[1]);
                if (type === -1) {
                    continue;
                }
                const modifier = match[2].length ? getModifier(match[2].split('.').slice(1)) : 0;

                data.push(
                    // translate line to deltaLine
                    i - prevLine,
                    // for the same line, translate start to deltaStart
                    prevLine === i ? match.index - prevChar : match.index,
                    match[0].length,
                    type,
                    modifier,
                );

                prevLine = i;
                prevChar = match.index;
            }
        }
        return {
            data: new Uint32Array(data),
            resultId: undefined,
        };
    },
    releaseDocumentSemanticTokens: () => {},
};
export default semanticsProvider;
