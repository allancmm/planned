import { debounce, WindowContainer } from 'equisoft-design-ui-elements';
import { editor, languages, KeyMod, KeyCode } from 'monaco-editor';
import React, { ReactElement, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { ThemeContext } from 'styled-components';
import { FileHeaderContainer } from '../../../components/editor/fileHeader/style';
import { useLayoutWithId, useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { SAVE_TAB_STATE, SET_LAYOUT_EDITOR } from '../../../components/editor/tabs/tabReducerTypes';
import { OVERRIDE_INSERT_ACTION } from './intellisense/intellisense/subIntellisense/snippets/smartSnippets';
import { intellisenseCache } from './intellisense/intellisense/subIntellisense/utils/intellisense';
import { createStyles, makeStyles } from '@material-ui/core';
import handleSymbolComments from './handleSymbolComments';

export type OverflowMonaco = 'visible' | 'hidden';
interface PropsStyle { overflow: OverflowMonaco }

const useStyles = makeStyles(() => createStyles({
    windowContainer: ({ overflow } : PropsStyle) =>
         ({
            overflow,
            zIndex: overflow === 'hidden' ? 1 : 5
        }),
    monacoContainer: ({ overflow } : PropsStyle) =>
        ({
            width: '100%',
            position: 'relative',
            height: '100%',
            overflow
        })
}));

interface MonacoContainerProps {
    tabId: string;
    layoutId: number;
    instance?: number;
    modelInstance?: number;

    defaultValue?: string;
    readOnly?: boolean;
    header?: ReactElement;
    theme?: string;
    lang?: string;
    overflow?: OverflowMonaco;
    defaultActions?: editor.IActionDescriptor[];
    onChangeContent?(): void;
    onDidChangeCursorPosition?(e: editor.ICursorPositionChangedEvent) : void;
    onDidChangeCursorSelection?(e: editor.ICursorSelectionChangedEvent) : void;
}

// those two are declared like this so they dont trigger the effect each render
const noOp = () => {};
const emptyArray: editor.IActionDescriptor[] = [];
const MonacoContainer = ({
    tabId,
    layoutId,
    header,
    readOnly = false,
    defaultValue = '',
    instance = 0,
    modelInstance = 0,
    lang = 'xml',
    theme = '',
    overflow = 'hidden',
    defaultActions = emptyArray,
    onChangeContent = noOp,
    onDidChangeCursorPosition,
    onDidChangeCursorSelection
}: MonacoContainerProps) => {
    const headerRef = useRef<HTMLDivElement>(null);
    const monacoRef = useRef<HTMLDivElement>(null);
    const selectedTheme = theme ? theme : useContext(ThemeContext).monaco;

    const classes = useStyles({ overflow });

    const dispatch = useTabActions();
    const tab = useTabWithId(tabId);
    const layout = useLayoutWithId(layoutId);

    let model = tab.model[modelInstance];
    const viewState = layout.viewState[tabId]?.[modelInstance];
    const actions = [...defaultActions, OVERRIDE_INSERT_ACTION];

    const monacoEffectDependencies = [
        layout.layoutId,
        defaultValue,
        readOnly,
        theme,
        modelInstance,
        lang,
        model?.isDisposed() ?? false,
        layout.editorInstance[instance]?.getModel() === null,
        onChangeContent,
        defaultActions,
    ];

    useLayoutEffect(() => {
        if (monacoRef.current) {
            // Mount monaco
            let editorInstance: editor.IStandaloneCodeEditor;

            if(!monacoRef.current?.hasChildNodes()) {
                if(layout.editorInstance[instance]){
                    if(layout.editorInstance[instance]?.getModel() === null){
                        editorInstance = layout.editorInstance[instance];
                    } else {
                        editorInstance = editor.create(monacoRef.current, {
                            readOnly,
                            theme: selectedTheme,
                            language: lang,
                            lineNumbersMinChars: 3,
                            model: null,
                            'semanticHighlighting.enabled': true,
                        });
                    }
                } else {
                    editorInstance = editor.create(monacoRef.current, {
                        readOnly,
                        theme: selectedTheme,
                        language: lang,
                        lineNumbersMinChars: 3,
                        model: null,
                        'semanticHighlighting.enabled': true,
                    });
                }
            } else {
                editorInstance = layout.editorInstance[instance];
            }

           onDidChangeCursorPosition && editorInstance.onDidChangeCursorPosition(onDidChangeCursorPosition);
           onDidChangeCursorSelection && editorInstance.onDidChangeCursorSelection(onDidChangeCursorSelection);
           
            if (editorInstance.getModel() === null) {
                if (model && viewState && !model.isDisposed()) {
                    // tab already exists, use model
                    editorInstance.setModel(model);
                    editorInstance.restoreViewState(viewState);
                    editorInstance.focus();
                } else if (defaultValue !== null && defaultValue !== undefined) {
                    // empty string is falsy, but should still create model
                    // tab is new, create model with entity
                    model = editor.createModel(defaultValue, lang);
                    editorInstance.setModel(model);
                    intellisenseCache.init(model.id, tab.data.getGuid(), tab.data.getType());
                    model.onWillDispose(() => model && intellisenseCache.destroy(model.id));
                    dispatch({
                        type: SAVE_TAB_STATE,
                        payload: {
                            id: tab.id,
                            layoutId,
                            viewState: editorInstance.saveViewState(),
                            model,
                            modelInstance,
                            layoutInstance: instance,
                        },
                    });
                }
            }

            editorInstance.updateOptions({ readOnly });
            editor.setTheme(selectedTheme);

            const disposableComment = editorInstance.addAction({
                id: 'editor.addComment',
                label: 'Add comment',
                keybindings: [ KeyMod.chord(KeyMod.CtrlCmd | KeyCode.US_SLASH, 0)],
                contextMenuGroupId: '1_navigation',
                contextMenuOrder: 0,
                run: handleSymbolComments
            });

            languages.setLanguageConfiguration(lang, {
                comments: { blockComment: ['', ''] },
                wordPattern: new RegExp(/(-?\d*\.\d\w*)|([^\`\~\!\#\%\^\&\@\*\(\)\-\=\+\[\{\]\}\\\|\;\'\"\,\.\<\>\/\?\s]+)/g)
            });

            const addedActions = actions
                .filter((a) => !editorInstance.getAction(a.id))
                .map((a) => editorInstance.addAction(a));
            addedActions.push(disposableComment);

            intellisenseCache.setActions(model?.id ?? '', editorInstance.getSupportedActions());
            dispatch({ type: SET_LAYOUT_EDITOR, payload: { layoutId, editorInstance, instance } });
            const disposeEvent = layout.editorInstance[instance]?.getModel()?.onDidChangeContent(onChangeContent);
            return () => {
                disposeEvent?.dispose();
                addedActions.forEach((a) => a.dispose());
            };
        }
        return () => {};
    }, monacoEffectDependencies);

    // Use this to debug the re-renders of effect
    // import { useWhatChanged } from '@simbathesailor/use-what-changed';
    // useWhatChanged(monacoEffectDependencies);

    useEffect(() => {
        return () => {
            dispatch({
                type: SAVE_TAB_STATE,
                payload: {
                    id: tab.id,
                    layoutId,
                    modelInstance,
                    layoutInstance: instance,
                },
            });
        };
    }, [tab.id, layoutId, modelInstance, instance]);

    useLayoutEffect(() => {
        setupCorrectContainerHeight();
    }, [headerRef.current]);

    const setupCorrectContainerHeight = () => {
        layout.editorInstance?.forEach((e) => e?.layout());
    };

    useEffect(() => {
        const resizeObserver = new ResizeObserver(debounce(setupCorrectContainerHeight, 100));
        if (monacoRef.current) resizeObserver.observe(monacoRef.current);
        if (headerRef.current) resizeObserver.observe(headerRef.current);

        return () => {
            if (monacoRef.current) resizeObserver.unobserve(monacoRef.current);
            if (headerRef.current) resizeObserver.unobserve(headerRef.current);
        };
    }, [layout.layoutId, layout.editorInstance]);

    return (
        <WindowContainer className={classes.windowContainer}>
            {header && <FileHeaderContainer ref={headerRef}>{header}</FileHeaderContainer>}
            <div ref={monacoRef} className={classes.monacoContainer} />
        </WindowContainer>
    );
};

export default MonacoContainer;
