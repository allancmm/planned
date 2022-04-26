// i dont like this, but until monaco fixes https://stackoverflow.com/questions/64042617/identifier-global-has-already-been-declared-at-compilefunction-error-in-jest
// we have no choice but to mock monaco

module.exports = {
    languages: {
        registerDocumentFormattingEditProvider: function (name, tokens) {},
        registerCompletionItemProvider: function (name, provider) {},
        setLanguageConfiguration: function (name, provider) {},
        registerDocumentSemanticTokensProvider: function (name, provider) {},
    },
    editor: {
        createModel: function (name, provider) {},
        createDiffEditor: function (name, provider) {},
        createDiffEditor: function (name, provider) {},
        setTheme: function (name) {},
        defineTheme: function (name, provider) {},
    },
};
