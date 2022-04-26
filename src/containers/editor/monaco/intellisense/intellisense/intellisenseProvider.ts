import { editor, IRange, languages, Position } from 'monaco-editor';
import { suggestActionsAttributes, suggestMathVariableAttributes } from './subIntellisense/attributeIntellisense';
import {
    suggestAttributes,
    suggestAttributeValues,
    suggestTags,
    suggestTopTags,
} from './subIntellisense/baseIntellisense';
import { suggestMathVariableContent, suggestTagContent } from './subIntellisense/contentIntellisense';
import { suggestForExpression } from './subIntellisense/expressionIntellisense';
import { SMART_SNIPPET_CHAR, suggestSmartSnippets } from './subIntellisense/snippets/smartSnippets';
import { suggestContextSnippets, suggestHotKeysSnippets } from './subIntellisense/snippetsIntellisense';
import { intellisenseCache } from './subIntellisense/utils/intellisense';
import { getLastOpenedTag, tokenizeTag, tokenizeText } from './subIntellisense/utils/parsingUtils';
import {
    suggestActionAttributesValues,
    suggestAttributeValuesOverrides,
    suggestMathVariableValues,
} from './subIntellisense/valueIntellisense';

export default async (model: editor.ITextModel, position: Position) => {
    // for some reason monaco uses 1 as their start index, so you will see a lot of +/- 1 when dealing with indexes
    const suggestions: languages.CompletionItem[] = [];
    intellisenseCache.start(model.id);

    const textBeforePosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
    });
    const currentWord = model.getWordUntilPosition(position);
    const textAfterPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: model.getLineCount(),
        endColumn: model.getLineMaxColumn(model.getLineCount()),
    });
    const parent = getLastOpenedTag(textBeforePosition);

    const tagBeforePosition = textBeforePosition.substring(textBeforePosition.lastIndexOf('<'));
    const tagBeforeWithoutWord = tagBeforePosition.replace(new RegExp(currentWord.word + '$'), '');
    const tagAfterPosition = textAfterPosition.substring(0, textAfterPosition.indexOf('>') + 1);

    const isClosingTag = tagBeforePosition.includes('/');
    const isInTag = tagBeforePosition.lastIndexOf('<') > tagBeforePosition.lastIndexOf('>') && !isClosingTag;
    const isAttributeName = isInTag && tagBeforeWithoutWord.endsWith(' ');
    const isAttributeValue = isInTag && (tagBeforeWithoutWord.endsWith('"') || tagBeforeWithoutWord.endsWith('='));

    const isExpressionVariable =
        tagBeforeWithoutWord.endsWith("'[") ||
        tagBeforeWithoutWord.endsWith('(') ||
        (tagBeforeWithoutWord.lastIndexOf('(') > tagBeforeWithoutWord.lastIndexOf(')') &&
            tagBeforeWithoutWord.endsWith(','));

    const tagWithoutWord = (tagBeforePosition + tagAfterPosition).trim();

    const tags = tokenizeText(textBeforePosition);
    const line = tokenizeTag(tagWithoutWord);
    line.level = tags[0]?.level ?? 0;

    const replaceRange: IRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: currentWord.startColumn,
        endColumn: currentWord.endColumn,
    };

    if (isAttributeName) {
        if (line.tag === 'MathVariable') {
            suggestions.push(...suggestMathVariableAttributes(line, replaceRange));
        } else if (line.tag === 'Action') {
            suggestions.push(...suggestActionsAttributes(line, replaceRange));
        } else {
            suggestions.push(...suggestAttributes(line.tag, replaceRange));
        }
    } else if (isAttributeValue) {
        const wrap = !tagBeforeWithoutWord.endsWith('"');

        const attrs = tagBeforeWithoutWord.split(' ');
        let currentAttribute = attrs[attrs.length - 1];
        currentAttribute = currentAttribute.replace('=', '');
        if (!wrap) {
            currentAttribute = currentAttribute.replace('"', '');
        }
        if (line.tag === 'MathVariable') {
            suggestions.push(...(await suggestMathVariableValues(line, tags, currentAttribute, wrap, replaceRange)));
        } else if (line.tag === 'Action') {
            suggestions.push(
                ...(await suggestActionAttributesValues(line, tags, currentAttribute, wrap, replaceRange)),
            );
        } else {
            suggestions.push(...suggestAttributeValues(line.tag, currentAttribute, wrap, replaceRange));
        }
        suggestions.push(...(await suggestAttributeValuesOverrides(line, tags, currentAttribute, wrap, replaceRange)));
    } else {
        if (isInTag) {
            if (parent) {
                suggestions.push({
                    label: `/${parent}`,
                    kind: languages.CompletionItemKind.Field,
                    detail: 'Close current Tag',
                    insertText: !tagWithoutWord.includes('/') ? `/${parent}` : parent,
                    range: replaceRange,
                });
                suggestions.push(...suggestTags(parent, replaceRange, !textAfterPosition.startsWith('>')));
            } else {
                suggestions.push(...suggestTopTags(replaceRange, !textAfterPosition.startsWith('>')));
            }
        } else {
            if (line.tag === 'MathVariable') {
                suggestions.push(...(await suggestMathVariableContent(line, tags, replaceRange)));
            } else {
                suggestions.push(...(await suggestTagContent(line, tags, replaceRange)));
            }

            if (currentWord.word.startsWith(SMART_SNIPPET_CHAR)) {
                suggestions.push(...(await suggestSmartSnippets(currentWord.word, replaceRange)));
            } else {
                suggestions.push(...(await suggestHotKeysSnippets(replaceRange)));
                suggestions.push(
                    ...(await suggestContextSnippets(tags, replaceRange, !isClosingTag ? line : line.getParent(tags))),
                );
            }
        }

        if (isExpressionVariable) {
            suggestions.unshift(...(await suggestForExpression(line, isAttributeValue, tags, replaceRange)));
        }
    }

    intellisenseCache.finish();
    return { suggestions };
};
