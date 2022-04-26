import { debounce, WindowContainer } from 'equisoft-design-ui-elements';
import { editor } from 'monaco-editor';
import React, { ReactElement, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { ThemeContext } from 'styled-components';
import { FileHeaderContainer } from '../../../components/editor/fileHeader/style';
import { useLayoutWithId, useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { SAVE_DIFF_TAB_STATE, SET_DIFF_LAYOUT_EDITOR } from '../../../components/editor/tabs/tabReducerTypes';
import { intellisenseCache } from './intellisense/intellisense/subIntellisense/utils/intellisense';

interface MonacoDiffProps {
    tabId: string;
    layoutId: number;

    readOnly?: boolean;
    defaultValueOriginal?: string;
    defaultValueModified?: string;
    header?: ReactElement;
}

const MonacoDiff = ({
    tabId,
    layoutId,
    defaultValueOriginal = '',
    defaultValueModified = '',
    readOnly = false,
    header,
}: MonacoDiffProps) => {
    const monacoRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const theme = useContext(ThemeContext);

    const dispatch = useTabActions();
    const tab = useTabWithId(tabId);
    const layout = useLayoutWithId(layoutId);

    let model = tab.model;
    const viewDiffState = layout.viewDiffState[tabId];

    const setupCorrectContainerHeight = () => {
        layout.editorDiffInstance?.layout();
    };

    const monacoEffectDependencies = [
        layout.layoutId,
        defaultValueOriginal,
        defaultValueModified,
        model[0]?.isDisposed(),
        model[1]?.isDisposed(),
        readOnly,
        theme,
    ];
    useLayoutEffect(() => {
        if (monacoRef.current) {
            // Mount monaco
            let editorDiffInstance: editor.IStandaloneDiffEditor;
            if (!monacoRef.current?.hasChildNodes() || !layout.editorDiffInstance) {
                editorDiffInstance = editor.createDiffEditor(monacoRef.current, {
                    theme: theme.monaco,
                    lineNumbersMinChars: 3,
                    readOnly,
                    originalEditable: !readOnly,
                });
                editorDiffInstance.setModel(null);
            } else {
                editorDiffInstance = layout.editorDiffInstance;
            }

            const models = editorDiffInstance.getModel();
            if (!models?.original || !models?.modified) {
                if (model[0] && model[1] && viewDiffState && !model[0].isDisposed() && !model[1].isDisposed()) {
                    // tab already exists, use model
                    editorDiffInstance.setModel({
                        original: model[0],
                        modified: model[1],
                    });
                    editorDiffInstance.restoreViewState(viewDiffState);
                    editorDiffInstance.focus();
                } else if (
                    (defaultValueOriginal !== null || defaultValueOriginal !== undefined) &&
                    (defaultValueModified !== null || defaultValueModified !== undefined)
                ) {
                    // empty string is falsy, but should still create model
                    // tab is new, create model with entity
                    model = [];
                    model[0] = editor.createModel(defaultValueOriginal, 'xml');
                    model[1] = editor.createModel(defaultValueModified, 'xml');
                    editorDiffInstance.setModel({
                        original: model[0],
                        modified: model[1],
                    });
                    model.forEach((m) => {
                        if (m) {
                            intellisenseCache.init(m.id, tab.data.getGuid(), tab.data.getType());
                            m.onWillDispose(() => m && intellisenseCache.destroy(m.id));
                        }
                    });

                    dispatch({
                        type: SAVE_DIFF_TAB_STATE,
                        payload: { id: tab.id, layoutId, viewDiffState: editorDiffInstance.saveViewState(), model },
                    });
                }
            }
            editorDiffInstance.updateOptions({ readOnly, originalEditable: !readOnly });
            editor.setTheme(theme.monaco);
            dispatch({ type: SET_DIFF_LAYOUT_EDITOR, payload: { layoutId, editorDiffInstance } });
        }
    }, monacoEffectDependencies);

    // Use this to debug the re-renders of effect
    // import { useWhatChanged } from '@simbathesailor/use-what-changed';
    // useWhatChanged(monacoEffectDependencies);

    useEffect(() => {
        return () => {
            dispatch({
                type: SAVE_DIFF_TAB_STATE,
                payload: { id: tab.id, layoutId },
            });
        };
    }, [tab.id, layoutId]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(debounce(setupCorrectContainerHeight, 100));
        if (monacoRef.current) resizeObserver.observe(monacoRef.current);
        if (headerRef.current) resizeObserver.observe(headerRef.current);

        return () => {
            if (monacoRef.current) resizeObserver.unobserve(monacoRef.current);
            if (headerRef.current) resizeObserver.unobserve(headerRef.current);
        };
    }, [layout.layoutId, layout.editorDiffInstance]);

    return (
        <WindowContainer>
            {header && <FileHeaderContainer ref={headerRef}>{header}</FileHeaderContainer>}
            <div
                style={{
                    width: '100%',
                    position: 'relative',
                    height: '100%',
                    overflow: 'hidden',
                }}
                ref={monacoRef}
            />
        </WindowContainer>
    );
};

export default MonacoDiff;
