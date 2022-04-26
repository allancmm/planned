import { SplitWrapper, WindowHeader, WindowTitle } from 'equisoft-design-ui-elements';
import { editor, Range, Selection } from 'monaco-editor';
import React, { useContext, useLayoutEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import FileHeader from '../../components/editor/fileHeader';
import { useLayoutWithId, useTabActions, useTabWithId } from '../../components/editor/tabs/tabContext';
import { CLOSE, OPEN, SAVE_TAB_STATE } from '../../components/editor/tabs/tabReducerTypes';
import { ContainerFlex, MainContainer } from '../../components/general/miscellaneous';
import { RightbarContext } from '../../components/general/sidebar/rightbarContext';
import { SidebarContext } from '../../components/general/sidebar/sidebarContext';
import { defaultEntitiesService, defaultEntityInformationService } from '../../lib/context';
import { ScmStatusType } from '../../lib/domain/entities/entityStatus';
import EntityInformation from '../../lib/domain/entities/tabData/entityInformation';
import InterpreterSession from '../../lib/domain/entities/tabData/interpreterSession';
import { brToEntityType, EntityType } from '../../lib/domain/enums/entityType';
import EntityService from '../../lib/services/entitiesService';
import EntityInformationService from '../../lib/services/entityInformationService';
import EntityData from './data';
import formLayout from './debugger/form';
import Interpreter from './interpreter/interpreter';
import MonacoContainer, { OverflowMonaco } from './monaco/monaco';
import EntitySecurityData from './securityData';

const COPYBOOK_TYPE_CODE = '04';
const COPYBOOK_OPEN_TAG = '<CopyBook>';
const COPYBOOK_CLOSE_TAG = '</CopyBook>';
const GLOBAL = 'GLOBAL';

interface EditorProps {
    tabId: string;
    layoutId: number;
    entityService: EntityService;
    entityInformationService: EntityInformationService;
}

const Editor = ({ tabId, layoutId }: EditorProps) => {
    const tab = useTabWithId(tabId);
    const layout = useLayoutWithId(layoutId);
    const { openRightbar } = useContext(RightbarContext);
    const { openSidebar, sidebarSize, sidebarType, closeSidebar, toggleRefreshSidebar } = useContext(SidebarContext);
    const dispatch = useTabActions();
    const [lineContent, setLineContent] = useState<string>('');
    const [lineNumber, setLineNumber] = useState<number>(0);
    const editorInstance: editor.IStandaloneCodeEditor = layout.editorInstance[0];
    const allValuesArray: string[] = editorInstance?.getModel()?.getLinesContent() ?? [];
    const [selectionContent, setSelectionContent] = useState<string>('');
    const selection = editorInstance?.getSelection() ?? new Selection(0, 0, 0, 0);
    const { startLineNumber, endLineNumber } = selection;

    const { data } = tab;
    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const interpreterId = data.generateInterpreterTabId();
    const interpreterTab = useTabWithId(interpreterId);
    const interData = interpreterTab?.data as InterpreterSession;
    const [split, setSplit] = useState(data.interpreterOpened);
    const [overflowMonaco, setOverflowMonaco] = useState<OverflowMonaco>('hidden');

    useLayoutEffect(() => {
        if (interData) {
            setSplit(!interData.standalone);
        }
    }, [interData?.standalone]);

    const canHaveDebug =
        formLayout[brToEntityType(data.oipaRule.entityType, data.typeCode)] ||
        data.oipaRule.ruleName === 'ValuationEngine';

    const toggleDebug = () => {
        if (!split) {
            dispatch({
                type: SAVE_TAB_STATE,
                payload: {
                    id: tabId,
                    layoutId: layoutId,
                    modelInstance: 0,
                    layoutInstance: 0,
                },
            });

            const interpreterEntityType: EntityType =
                data.oipaRule.ruleName === 'ValuationEngine'
                    ? 'POLICY_VALUE'
                    : brToEntityType(data.oipaRule.entityType, data.typeCode);

            dispatch({
                type: OPEN,
                payload: {
                    data: interData ?? data.createInterpreterData(data.oipaRule.ruleGuid, interpreterEntityType),
                    hidden: true,
                },
            });
            if (sidebarType !== 'Debug' || sidebarSize === 0) {
                openSidebar('Debug');
            }
            toggleRefreshSidebar();
        } else {
            if (!interData.standalone) {
                if (sidebarType === 'Debug') closeSidebar();
                dispatch({ type: CLOSE, payload: { id: interpreterId, layoutId: layoutId } });
            }
        }
        setSplit(!split);
    };

    const handleBusinessRuleName = (
        businessRuleName: string,
        originalName: string,
        isNewLine: boolean,
        isSelection: boolean,
    ) => {
        if (isSelection) {
            const newContent = COPYBOOK_OPEN_TAG + businessRuleName + COPYBOOK_CLOSE_TAG + '\n';
            const range = new Range(startLineNumber, 0, endLineNumber + 1, 0);
            editorInstance.executeEdits('', [{ range: range, text: newContent }]);
        } else {
            if (lineNumber) {
                if (isNewLine) {
                    const newContent = COPYBOOK_OPEN_TAG + businessRuleName + COPYBOOK_CLOSE_TAG + '\n';
                    const range = new Range(lineNumber + 1, 0, lineNumber + 1, 0);
                    editorInstance.executeEdits('', [{ range, text: newContent }]);
                } else {
                    const newContent = originalName
                        ? lineContent.replace(originalName, businessRuleName)
                        : COPYBOOK_OPEN_TAG + businessRuleName + COPYBOOK_CLOSE_TAG;
                    const range = new Range(lineNumber, 0, lineNumber, allValuesArray[lineNumber - 1].length + 1);
                    editorInstance.executeEdits('', [{ range, text: newContent }]);
                }
            }
        }
        editorInstance.getAction('editor.action.formatDocument').run();
    };

    const displayDefaultOptions: editor.IActionDescriptor[] = useMemo(() => {
        {
            if (data.status.status === ('checkOut' as ScmStatusType)) {
                if (selectionContent === '') {
                    return [
                        {
                            id: 'create-copybook',
                            label: 'Create New Global CopyBook',
                            keybindings: [],
                            contextMenuGroupId: '0_generate',
                            contextMenuOrder: 0.5,
                            run: async () => {
                                const lineTrim = lineContent.trim();
                                const tagContent =
                                    lineTrim.startsWith(COPYBOOK_OPEN_TAG) && lineTrim.endsWith(COPYBOOK_CLOSE_TAG)
                                        ? lineTrim.replace(COPYBOOK_OPEN_TAG, '').replace(COPYBOOK_CLOSE_TAG, '')
                                        : '';

                                openRightbar('Create_Rule_entity', {
                                    isFastCreation: true,
                                    defaultName: tagContent,
                                    overrideGuid: '',
                                    typeCode: COPYBOOK_TYPE_CODE,
                                    overrideLevel: GLOBAL,
                                    isNewLine:
                                        lineTrim.startsWith(COPYBOOK_OPEN_TAG) && lineTrim.endsWith(COPYBOOK_CLOSE_TAG)
                                            ? false
                                            : true,
                                    handleBusinessRuleName: handleBusinessRuleName,
                                });
                            },
                        },
                    ];
                } else {
                    return [
                        {
                            id: 'convert-copybook',
                            label: 'Convert into CopyBook',
                            keybindings: [],
                            contextMenuGroupId: '0_generate',
                            contextMenuOrder: 0.5,
                            run: async () => {
                                openRightbar('Create_Rule_entity', {
                                    isFastCreation: true,
                                    defaultName: '',
                                    overrideGuid: '',
                                    typeCode: COPYBOOK_TYPE_CODE,
                                    overrideLevel: 'GLOBAL',
                                    isNewLine: true,
                                    copybookContent: selectionContent,
                                    convertSelection: true,
                                    handleBusinessRuleName: handleBusinessRuleName,
                                });
                            },
                        },
                    ];
                }
            }

            return [];
        }
    }, [data, lineContent, lineNumber, selectionContent]);

    const Header = <FileHeader tabId={tabId} {...{ toggleDebug: canHaveDebug ? toggleDebug : undefined }} />;
    const BaseEditor =
        data.fileType !== 'DATA' ? (
            data.fileType !== 'SECURITY_DATA' ? (
                <MonacoContainer
                    tabId={tabId}
                    layoutId={layoutId}
                    header={Header}
                    readOnly={data.status.readOnly}
                    // todo: -kayu- band-aid, need to normalize data from oracle and ms sql in the back-end
                    defaultValue={data.dataString ? data.dataString : ''}
                    defaultActions={displayDefaultOptions}
                    onDidChangeCursorPosition={(e: editor.ICursorPositionChangedEvent) => {
                        setLineContent(editorInstance?.getModel()?.getLineContent?.(e.position.lineNumber) ?? '');
                        setLineNumber(e.position.lineNumber);
                    }}
                    onDidChangeCursorSelection={(e: editor.ICursorSelectionChangedEvent) => {
                        setSelectionContent(editorInstance?.getModel()?.getValueInRange?.(e.selection) ?? '');
                    }}
                    overflow={overflowMonaco}
                />
            ) : (
                <EntitySecurityData tabId={tabId} header={Header} />
            )
        ) : (
            <EntityData tabId={tabId} header={Header} />
        );

    if (!split) {
        return BaseEditor;
    } else {
        return (
            <SplitWrapper
                cursor={'col-resize'}
                direction={'vertical'}
                defaultSizes={[50, 50]}
                onDragEnd={() => setOverflowMonaco('hidden')}
            >
                <ContainerFlex onClick={() => setOverflowMonaco('visible')}>{BaseEditor}</ContainerFlex>

                <MainContainer>
                    <WindowHeader>
                        <WindowTitle>Debug</WindowTitle>
                    </WindowHeader>
                    <Interpreter tabId={interpreterId} layoutId={layoutId} instance={1} />
                </MainContainer>
            </SplitWrapper>
        );
    }
};

Editor.defaultProps = {
    entityService: defaultEntitiesService,
    entityInformationService: defaultEntityInformationService,
};
export default Editor;
