import { IRange, languages } from 'monaco-editor';
import { schema, topTags } from './utils/schema';

export const suggestAttributes = (parent: string, range: IRange): languages.CompletionItem[] => {
    const parentSchema = schema[parent];
    return Object.keys(parentSchema?.attrs ?? {}).map((a) => ({
        label: a,
        kind: languages.CompletionItemKind.Property,
        detail: a,
        insertText: a,
        range,
    }));
};

export const suggestAttributeValues = (
    parent: string,
    attribute: string,
    wrap: boolean,
    range: IRange,
): languages.CompletionItem[] => {
    const parentSchema = schema[parent];
    return (
        parentSchema?.attrs?.[attribute]?.map((v) => ({
            label: v,
            kind: languages.CompletionItemKind.Value,
            detail: v + '\n' + (wrap ? `"${v}"` : v),
            insertText: wrap ? `"${v}"` : v,
            range,
        })) ?? []
    );
};

export const suggestTopTags = (range: IRange, endWrap: boolean): languages.CompletionItem[] => {
    return topTags.map((t) => ({
        label: t,
        kind: languages.CompletionItemKind.Field,
        detail: t + '\n' + `${t}>\${1}</${t}${endWrap ? '>' : ''}`,
        insertText: `${t}>\${1}</${t}${endWrap ? '>' : ''}`,
        range,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
    }));
};

export const suggestTags = (parent: string, range: IRange, endWrap: boolean): languages.CompletionItem[] => {
    const parentSchema = schema[parent];
    return (
        parentSchema?.children?.map((t) => ({
            label: t,
            kind: languages.CompletionItemKind.Field,
            detail: t + '\n' + `${t}>\${1}</${t}${endWrap ? '>' : ''}`,
            insertText: `${t}>\${1}</${t}${endWrap ? '>' : ''}`,
            range,
            insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        })) ?? []
    );
};
