import { IRange, languages } from 'monaco-editor';
import { intellisenseCache } from './utils/intellisense';
import { TokenTag } from './utils/parsingUtils';

export const suggestForExpression = async (
    line: TokenTag,
    isAttributeValue: boolean,
    tags: TokenTag[],
    range: IRange,
): Promise<languages.CompletionItem[]> => {
    const suggestions: languages.CompletionItem[] = [];
    /*
        Cases:
        <Action ACTIONTYPE="SQLQUERY">
        
        <Query TYPE="SQL">
        <MathVariable TYPE="SQL">

        <MathVariable TYPE="COLLECTION" (operation attr missing)>
    
        <MathVariable TYPE="ACTIVITYARRAY" OPERATION="FILLBY-SQL">

        <MathLoop CONDITION=

        IF expressions
  
        What to do:
        parse for '[]' and suggest mv?, fields?
        parse for () (invoking a function) for mv?, fields
    
    */

    // this does nothing, i just want to remove the unused variables error
    intellisenseCache.placeholder(tags[0].tag);

    suggestions.push({
        label: 'im a expression var (NYI)',
        kind: languages.CompletionItemKind.Variable,
        detail: line.tag,
        insertText: `${isAttributeValue}`,
        range,
    });
    return suggestions;
};
