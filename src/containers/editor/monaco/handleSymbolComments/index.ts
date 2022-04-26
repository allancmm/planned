import { editor, Range, Selection } from 'monaco-editor';

const OPEN_COMMENT = '<!--';
const CLOSE_COMMENT = '-->';
const OPEN_COMMENT_INT = '<!-/-';
const CLOSE_COM_INT = '-/->';

const regexStart = /<!--|<!-\/-/g;
const regexEnd = /-->|-\/->/g;
const regexIncludeSymbolComment = /<!--|<!-\/-|-->|-\/->/g;

const handleSymbolComments = (editorParam: editor.ICodeEditor) : void => {
    const selection = editorParam.getSelection() ?? new Selection(0, 0, 0, 0);
    const { startLineNumber, startColumn, endLineNumber, endColumn } = selection;
    const allValuesArray: string[] = editorParam.getModel()?.getLinesContent() ?? [];
    const selectedText = editorParam?.getModel()?.getValueInRange(selection) ?? '';

    const isInsideBlockCommented = (startLine: number, endLine: number) => {
        const allValuesUpdated: string[] = editorParam.getModel()?.getLinesContent() ?? [];

        let isCommentBefore: boolean;
        let isCommentAfter: boolean;

        const textBefore = allValuesUpdated.slice(0, startLine).join('');
        const textAfter = allValuesUpdated.slice(endLine, allValuesUpdated.length).join('');

        const { countInit, countEnd } = countComment(textBefore);
        isCommentBefore = countInit > countEnd;

        const { countInit: countStartAfter, countEnd: countEndAfter } = countComment(textAfter);
        isCommentAfter = countEndAfter > countStartAfter;

        return isCommentBefore && isCommentAfter;
    };

    const handleSingleLineComment = () => {
        if(isLineCommented(allValuesArray[startLineNumber - 1])) {
            const text = replaceAllSymbolComment(allValuesArray[startLineNumber - 1]);
            const range = new Range(startLineNumber, 0, startLineNumber, allValuesArray[startLineNumber - 1].length + 1);
            editorParam.executeEdits('', [{ range, text }]);
        } else {
            const isInsideBlock = isInsideBlockCommented(startLineNumber, startLineNumber);
            const { actualOpen, actualClose } = getActualSymbol(isInsideBlock);
            const range = new Range(startLineNumber, 0, startLineNumber, allValuesArray[startLineNumber - 1].length + 1);
            const text = `${actualOpen} ${allValuesArray[startLineNumber - 1].trim()} ${actualClose}`;
            editorParam.executeEdits('', [{ range, text }]);
        }
    }

    const handleBlockAlreadyCommented = () => {
        let firstLine: string;
        let lastLine: string;
        if(isInsideBlockCommented(startLineNumber, endLineNumber)) {
            firstLine = allValuesArray[startLineNumber - 1].replace(/<!-\/-/, '');
            lastLine  = allValuesArray[endLineNumber - 1].replace(/-\/->/, '');
        } else {
            firstLine = allValuesArray[startLineNumber - 1].replace(/<!--/, '');
            lastLine  = allValuesArray[endLineNumber - 1].replace(/ -->/, '');
        }

        const initialRange = new Range(startLineNumber, 0, startLineNumber, allValuesArray[startLineNumber - 1].length + 1);
        const lastRange = new Range(endLineNumber, 0, endLineNumber, endColumn);
        editorParam.executeEdits('', [{ range: initialRange, text:  firstLine }, { range: lastRange, text:  lastLine }]);

        if(selectedText.match(regexIncludeSymbolComment)) {
            const allValuesUpdated: string[] = editorParam.getModel()?.getLinesContent() ?? [];
            for(let x = startLineNumber - 1; x < endLineNumber - 1; x++) {
                if(allValuesUpdated[x].match(regexIncludeSymbolComment)) {
                    const isInsideBlock = isInsideBlockCommented(x, x + 1);
                    const text = isInsideBlock ?
                        outsideToInsideComment(allValuesUpdated[x])
                        :
                        allValuesUpdated[x].replace(OPEN_COMMENT_INT, OPEN_COMMENT).replace(CLOSE_COM_INT, CLOSE_COMMENT);
                    const range = new Range(x + 1, 0, x + 1, text.length + 3);
                    editorParam.executeEdits('', [{ range, text }]);
                }
            }
        }
    }

    const handleHasInsideComment = () => {
        if(selectedText.includes(CLOSE_COMMENT)) {
            for(let x = startLineNumber; x <= endLineNumber; x++) {
                const text = outsideToInsideComment(allValuesArray[x - 1]);
                const range = new Range(x, 0, x, text.length + 2);
                editorParam.executeEdits('', [{ range, text }]);
            }
        }
    }
    const handleBlockNotCommented = () => {
        handleHasInsideComment();

        const allValuesUpdated: string[] = editorParam.getModel()?.getLinesContent() ?? [];

        const isInsideBlock = isInsideBlockCommented(startLineNumber, endLineNumber);
        const { actualOpen, actualClose } = getActualSymbol(isInsideBlock);
        const firstLine = `${actualOpen} ${allValuesUpdated[startLineNumber - 1].trim()}`;
        const lastLine = `${allValuesUpdated[endLineNumber - 1]} ${actualClose}`;
        editorParam.executeEdits('', [
            { range: new Range(startLineNumber, startColumn, startLineNumber, allValuesUpdated[startLineNumber - 1].length + 1), text:  firstLine },
            { range: new Range(endLineNumber, 0, endLineNumber, endColumn), text:  lastLine }
        ]);
    }

    if (startLineNumber === endLineNumber) {
        handleSingleLineComment();
    } else {
        const startLineText = allValuesArray[startLineNumber - 1];
        const lastLineText = allValuesArray[endLineNumber - 1];
        if(isBlockCommented(startLineText, lastLineText)) {
            handleBlockAlreadyCommented();
        } else {
            handleBlockNotCommented();
        }
    }
}

const isLineCommented = (line: string) : boolean =>
    (line.includes(OPEN_COMMENT) || line.includes(OPEN_COMMENT_INT)) && (line.includes(CLOSE_COMMENT) || line.includes(CLOSE_COM_INT));

const isBlockCommented = (startLine: string, lastLine: string ) : boolean =>
    (startLine.includes(OPEN_COMMENT) || startLine.includes(OPEN_COMMENT_INT)) &&
    (lastLine.includes(CLOSE_COMMENT) || lastLine.includes(CLOSE_COM_INT))

const replaceAllSymbolComment = (line: string) : string =>
    line.replace(OPEN_COMMENT, '').replace(OPEN_COMMENT_INT, '').replace(CLOSE_COMMENT, '').replace(CLOSE_COM_INT, '').trim();

const outsideToInsideComment = (line: string) => line.replace(OPEN_COMMENT, OPEN_COMMENT_INT).replace(CLOSE_COMMENT, CLOSE_COM_INT);

const getActualSymbol = (isInsideBlock: boolean) =>
    ({
        actualOpen: isInsideBlock ? OPEN_COMMENT_INT : OPEN_COMMENT,
        actualClose: isInsideBlock ? CLOSE_COM_INT : CLOSE_COMMENT
    });

const countComment = (text: string) => ({
    countInit: text.match(regexStart)?.length ?? 0,
    countEnd: text.match(regexEnd)?.length ?? 0
});

export default handleSymbolComments;
