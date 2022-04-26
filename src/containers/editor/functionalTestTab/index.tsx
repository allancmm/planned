import React, {
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    SplitWrapper,
    useBetterScrollingList,
    WindowContainer,
    useLoading, Loading
} from 'equisoft-design-ui-elements';
import produce, { Draft } from 'immer';
import { editor, KeyCode, KeyMod } from 'monaco-editor';
import { toast } from 'react-toastify';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA, MONACO_DISPOSE } from '../../../components/editor/tabs/tabReducerTypes';
import AutomatedTestCaseDetails from './automatedTestCaseDetails';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { defaultAutomatedTestService } from '../../../lib/context';
import AutomatedTestActionSoap from '../../../lib/domain/entities/automatedTestItems/automatedTestActionSoap';
import AutomatedTestAssessmentFileCompare from '../../../lib/domain/entities/automatedTestItems/automatedTestAssessmentFileCompare';
import AutomatedTestAssessmentSql from '../../../lib/domain/entities/automatedTestItems/automatedTestAssessmentSql';
import AutomatedTestCase from '../../../lib/domain/entities/automatedTestItems/automatedTestCase';
import AutomatedTestMath from '../../../lib/domain/entities/automatedTestItems/automatedTestMath';
import AutomatedTestResult from '../../../lib/domain/entities/automatedTestItems/automatedTestResult';
import AutomatedTestStep, {
    getDefaultValueForStep,
    updateXmlStep
} from '../../../lib/domain/entities/automatedTestItems/automatedTestStep';
import FunctionalTestSession from '../../../lib/domain/entities/tabData/functionalTestSession';
import AutomatedTestService from '../../../lib/services/automatedTestService';
import MonacoContainer from '../monaco/monaco';
import { CancelIcon, CheckIcon, RightButton } from "../../functionalTest/automatedTestTree/style";
import { v4 as uuid } from "uuid";
import AutomatedTask from "../../../lib/domain/entities/automatedTestItems/automatedTask";
import AutomatedTestVariables from './automatedTestVariables';
import FunctionalStepList from "./functionalStepList";
import AutomatedTestHeader from "./automatedTestHeader";
import { AutomatedTestStepChildType } from "../../../lib/domain/entities/automatedTestItems/automatedTestStepChild";
import StepHeader from "./stepHeader";
import { FunctionSidePanel, SuccessBadge, FailBadge, SkipBadge } from './style';
import { reorder } from "../../../components/dragDrop";
import { calculateLengthCollision } from "../../../components/dragDrop/helpers";
import Tabs from "../../../components/general/customTab";
import ResultLogTab from "../functionalTest/components/resultTab";
import { ResultMessageContainer } from "../functionalTestSuiteTab/style";
import useModalConfirm from '../../../components/editor/tabs/useModalConfirm';

const MESSAGE_CONFIRM = 'Do you want to save the test case before closing the tab?';

export type TypeField = 'typeStep' | 'nameStep' | 'childField';
export type ValueType = string | AutomatedTestStepChildType | null;

interface AutomatedTestTabProps {
    tabId: string;
    layoutId: number;
    automatedTestService: AutomatedTestService;
}

// TODO - Allan - Place useState variable inside FunctionalTestSession
const FunctionalTestTab = ({ tabId, layoutId, automatedTestService }: AutomatedTestTabProps) => {
    const tab = useTabWithId(tabId);
    const dispatch = useTabActions();

    const { data: session } = useTabWithId(tabId);

    if (!(session instanceof FunctionalTestSession)) {
        toast.error(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const { openRightbar } = useContext(RightbarContext);
    const [loading, load] = useLoading();

    const { automatedTestCase,
            testCaseResults,
            allTestResult,
            isRunningAll,
            isAllRan,
            saved,
            testCasePath,
            cursor,
            isRunning } = session;

    const [nameTestCase, setNameTestCase] = useState('');

    const [testRunning, setTestRunning] = useState<AutomatedTestResult>();
    const [listBadgesStatus, setListBadgeStatus ] = useState<{[ stepId: string] : JSX.Element}>({});

    const automatedTestStep = useMemo(() =>
        automatedTestCase.steps.filter((s) => !s.htmlInput)[cursor]
        , [automatedTestCase.steps, cursor]);

    const testCaseResult = useMemo(() => testCaseResults[cursor], [testCaseResults, cursor]);

    const listRef = useRef<HTMLUListElement>(null);
    const cursorRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        fetchTestCase();
    }, []);

    useEffect(() => {
        setTestRunning(testCaseResults[cursor]);
    }, [testCaseResults[cursor]]);

    useEffect(() => {
        setTestRunning(allTestResult);
    }, [allTestResult]);

    useEffect(() => {
        let interval: any;
        if (testRunning?.isRunning()) {
            interval = setInterval(getRunning, 1000);
        } else {
            clearInterval(interval);
            if (testRunning?.isFinished()) {
                automatedTestService.clearRunningTestByRunningId(testRunning?.runningId);
            }
        }
        return () => clearInterval(interval);
    }, [testRunning]);

    useEffect(() => {
        updateSession((draft) => {
            draft.isRunning = isAllRan ? allTestResult?.isRunning() : testCaseResult?.isRunning()
        }, session, saved);
    }, [isAllRan, allTestResult, testCaseResult]);

    useEffect(() => {
        let resultTask : AutomatedTask | undefined;

        automatedTestCase.steps.forEach((step) => {
            const { id: stepId } = step;

            if(isRunningAll){
                resultTask = allTestResult?.tasks?.find((task) => task.name === stepId);
                defineBadgeStatus(stepId, resultTask?.status);
            } else {
                testCaseResults.forEach((r) => {
                    resultTask = r?.tasks?.find((task) => task.name === stepId);
                    defineBadgeStatus(stepId, resultTask?.status);
                });
            }
        });

    }, [automatedTestCase, isRunningAll, allTestResult, testCaseResults]);

    const renderTabContent = useMemo(() => {
        if(testCaseResult) {
            if(testCaseResult.isRunning()){
                return <ResultMessageContainer>Running...</ResultMessageContainer>;
            }
            return <ResultLogTab result={testCaseResult}/>;
        }

        return <ResultMessageContainer>Not executed yet</ResultMessageContainer>
    }, [testCaseResult]);

    const tabsResult = useMemo(() =>
        isAllRan ?
            [{ label: 'Result All', panelContent: <ResultLogTab result={allTestResult}/>}] :
            [{ label: `Result  ${automatedTestStep?.id}`,
               panelContent: renderTabContent
            }
        ]
    , [isAllRan, allTestResult, automatedTestStep, testCaseResult, renderTabContent]);

    useBetterScrollingList(listRef, cursorRef, [cursor]);

    useLayoutEffect(() => {
        listRef.current?.focus();
    }, []);

    const fetchTestCase = async (force: boolean = false) => {
        if (session.testCasePath.length > 0 && (!session.automatedTestCase.uuid || force)) {
            const newAutomatedTestCase: AutomatedTestCase =
                await load(async () => automatedTestService.getTestCase(session.testCasePath))();

            newAutomatedTestCase.steps.forEach((s, i) => (s.modelId = i));
            dispatch({ type: MONACO_DISPOSE, payload: { layoutId, dispose: 'all' } });
            updateSession(
                (draft) => {
                    draft.automatedTestCase = newAutomatedTestCase;
                },
                session,
                true,
            );
        }
    };

    const updateSession = (
        recipe: (draft: Draft<FunctionalTestSession>) => void,
        baseSession = session,
        statusSaved= false,
    ) => {
        const newSession = produce(baseSession, (draft) => {
            recipe(draft);
            draft.saved = statusSaved;
        });

        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: newSession,
            },
        });
        return newSession;
    };

    const moveStep = (delta: number) => {
        const index = cursor;
        if (index + delta >= 0 && index + delta < automatedTestCase.steps.length) {
            updateSession((draft) => {
                const item = draft.automatedTestCase.steps.splice(index, 1)[0];
                draft.automatedTestCase.steps.splice(index + delta, 0, item);
            }, handleCursorChange(index + delta, false));
        }
    };

    const toggleStep = () => {
        updateSession((draft) => {
            draft.automatedTestCase.steps[cursor].disabled = !draft.automatedTestCase.steps[cursor].disabled;
        });
    }

    const removeStep = () => {
        const index = cursor;
        updateSession((draft) => {
            const spliced = draft.automatedTestCase.steps.splice(index, 1);
            dispatch({ type: MONACO_DISPOSE, payload: { layoutId, dispose: spliced.map((s) => s.modelId) } });
        }, handleCursorChange(0));
    };

    const handleInputChange = (newAutomatedTestCase: AutomatedTestCase) => {
        updateSession((draft) => {
            draft.automatedTestCase = newAutomatedTestCase;
        });
    };

    const handleTypeChange = (field: TypeField, value : ValueType, editorWillChange = false) => {
        switch (field) {
            case "typeStep":
                dispatch({ type: MONACO_DISPOSE, payload: { layoutId, dispose: [automatedTestStep.modelId] } });
                updateSession((draft) => {
                    draft.automatedTestCase.steps[cursor].child = value as AutomatedTestStepChildType;
                });
                break;
            case "childField":
                if (editorWillChange) {
                    dispatch({ type: MONACO_DISPOSE,
                        payload: {
                            layoutId,
                            dispose: [automatedTestStep.modelId]
                        } });
                }
                updateSession((draft) => {
                    draft.automatedTestCase.steps[cursor].child = value as AutomatedTestStepChildType;
                });
                break;
            case "nameStep":
                updateSession((draft) => {
                    draft.automatedTestCase.steps[cursor].id = value as string;
                });
                break;
        }
    };

    const testCaseNameInput = (value?: string) =>
        <input type="text" autoFocus defaultValue={value}
               onClick={(e) => {
                          e?.stopPropagation();
                          e?.preventDefault();
                        }}
               onChange={(e) => {setNameTestCase(e?.target?.value);}}
        />;


    const addStep = () => {
        updateSession((draft) => {
            const newAutomatedTestStep = new AutomatedTestStep();
            newAutomatedTestStep.uuid = uuid();
            newAutomatedTestStep.modelId = Math.max(tab.model.length, automatedTestCase.steps.length);
            newAutomatedTestStep.htmlInput = testCaseNameInput('');
            draft.automatedTestCase.steps.push(newAutomatedTestStep);
        });
    };

    const handleDragDropStep = (dragDropStep: AutomatedTestStep, index: number) => {
        const currentPosition = automatedTestCase.steps.findIndex((s) => s.uuid === dragDropStep.uuid);
        if(currentPosition > -1) {
            handleCursorChange(index, true, true);
            updateSession((draft => {
                const newSteps = reorder(automatedTestCase.steps, currentPosition, index) as  AutomatedTestStep[];
                draft.automatedTestCase.steps = [...newSteps];
            }));
        } else {
            index <= automatedTestCase.steps.length && handleCursorChange(index, true, true);
            const lengthCollision = calculateLengthCollision(automatedTestCase.steps, 'id', dragDropStep.id);
            const newRowItem = {...(new AutomatedTestStep()),
                                ...( lengthCollision > 0 ?
                                        {...dragDropStep, id: dragDropStep.id + '_' + lengthCollision } : dragDropStep),
                                uuid: uuid()};
            updateSession((draft) => {
                newRowItem.modelId = Math.max(tab.model.length, automatedTestCase.steps.length);
                if(index <= draft.automatedTestCase.steps.length && draft.automatedTestCase.steps.length > 0){
                    draft.automatedTestCase.steps.splice(index, 0, newRowItem);
                } else {
                    draft.automatedTestCase.steps.push(newRowItem);
                }
            });
        }
    }

    const saveTestCase = async () => {
        const savedSession = produce(session, saveCurrentXml);
        await load(automatedTestService.saveTestCase)(savedSession.testCasePath, savedSession.automatedTestCase);
        await fetchTestCase(true);
        toast.success(`TestCase ${savedSession.automatedTestCase.id} has been saved`);
    };

    const { ModalConfirm } = useModalConfirm(saveTestCase, tabId, layoutId, MESSAGE_CONFIRM);

    const runTestSuite = () => {
        setListBadgeStatus({});
        updateSession((draft) => {
            draft.testCaseResults = [];
            draft.isRunningAll = false;
        }, session, saved);

        load(async () => automatedTestService.runTestCase(session.testCasePath))().then(updateAllTest);
    };

    const abortRunningTask = load(async () => {
        if(testRunning){
            await automatedTestService.abortRunningTask(testRunning.runningId);
            updateSession((draft) => {
                draft.allTestResult = new AutomatedTestResult();
                draft.testCaseResults = [];
                draft.isRunningAll = false;
                draft.isStepRan = false;
                draft.isAllRan = false;
            }, session, saved);
        }
    });

    const runStep = load(async () => {
        setListBadgeStatus((prev) => ({ ...prev, [automatedTestStep.id] : <></> }))
        automatedTestService
            .runStep(session.testCasePath, automatedTestStep.id)
            .then((resp) => {
                updateSession((draft) => {
                    draft.testCaseResults[cursor] = resp;
                    draft.isRunningAll = false;
                    draft.isStepRan = true;
                    draft.isAllRan = false;
                }, session, saved);
            });
    });

    const updateAllTest = (resp: AutomatedTestResult) => {
        updateSession((draft) => {
            draft.allTestResult = resp;
            draft.isRunningAll = draft.isAllRan = true;
            draft.isStepRan = false;
        }, session, saved);
    };

    const getRunning = async () => {
        if(testRunning){
            await automatedTestService.getRunning(testRunning.runningId).then((resp) => {
                if(isAllRan) {
                    updateAllTest(resp);
                } else {
                    updateSession((draft) => {
                        draft.testCaseResults[cursor] = resp;
                        draft.isRunningAll = false;
                        draft.isStepRan = true;
                        draft.isAllRan = false;
                    }, session, saved);
                }
            });
        }
    };

    const xmlHasChanged = (current: AutomatedTestStep): boolean => {
        if (current) {
            let editorText;
            try {
                editorText = tab.model[current.modelId]?.getValue() ?? '';
            } catch (e) {
                editorText = '';
            }

            if (current) {
                switch (current.child?.type) {
                    case 'ActionSoap':
                        return (current.child as AutomatedTestActionSoap).xml !== editorText;
                    case 'Math':
                        return (current.child as AutomatedTestMath).xml !== editorText;
                    case 'AssessmentSql':
                        return (current.child as AutomatedTestAssessmentSql).xml !== editorText;
                    case 'AssessmentFileCompare':
                        return (current.child as AutomatedTestAssessmentFileCompare).expectedResult !== editorText;
                }
            }
        }
        return false;
    };

    const saveCurrentXml = (draft: Draft<FunctionalTestSession>) => {
        const current = draft.automatedTestCase.steps[cursor];

        if (current) {
            let editorText;
            try {
                editorText = tab.model[current.modelId]?.getValue() ?? '';
            } catch (e) {
                editorText = '';
            }
            draft.automatedTestCase.steps[cursor] = updateXmlStep(current, editorText);
        }
    };

    const handleCursorChange = (newCursor: number, editorWillChange = true, forceUpdate = false, previousSession = session) => {
        if (newCursor !== cursor || forceUpdate) {
            const newSession = updateSession((draft) => {
                draft.cursor = newCursor;
            }, session, saved);
            if (editorWillChange) {
                dispatch({ type: MONACO_DISPOSE, payload: { layoutId } });
                if (xmlHasChanged(automatedTestStep)) {
                    return updateSession(saveCurrentXml, previousSession);
                }
            }
            return newSession;
        }
        return session;
    };

    const actionsAddStep = (step: AutomatedTestStep) =>
        (step.htmlInput) ?
            <>
                <RightButton type="submit" buttonType="tertiary" onClick={() => {
                    if(nameTestCase){
                        const index = automatedTestCase.steps.findIndex((t ) => t.uuid === step.uuid);
                        handleCursorChange(index);
                        updateSession((draft) => {
                            const currentStep = draft.automatedTestCase.steps[index];
                            currentStep.id = nameTestCase;
                            currentStep.htmlInput = null;
                        });
                    } else {
                        toast.error('Step name cannot be empty');
                    }

                }}>
                    <CheckIcon/>
                </RightButton>
                <RightButton buttonType="tertiary" onClick={() => {
                    updateSession((draft) => {
                        draft.automatedTestCase.steps.pop();
                    });
                }}>
                    <CancelIcon/>
                </RightButton>
            </>
            : <></>

    const monacoActions: editor.IActionDescriptor[] = useMemo(
        () => [
            {
                id: 'fct-tests-generate-xml',
                label: 'Add XML',
                keybindings: [KeyMod.chord(KeyMod.CtrlCmd | KeyCode.KEY_K, KeyMod.CtrlCmd | KeyCode.KEY_X)],
                contextMenuGroupId: '0_generate',
                contextMenuOrder: 0.5,
                run: () => {
                    openRightbar('Generate_Xml', { tabId, layoutId, stepId: cursor });
                },
            },
        ],
        [openRightbar, tabId, layoutId, cursor],
    );

    const defineBadgeStatus = (stepId: string, status? : string) => {
        switch (status) {
            case 'SUCCESS':
                setListBadgeStatus((prev) => ({...prev, [stepId]: <SuccessBadge title='Success' /> }));
                break;
            case 'FAIL':
                setListBadgeStatus((prev) => ({...prev, [stepId]: <FailBadge title='Fail' /> }));
                break;
            case 'SKIP':
                setListBadgeStatus((prev) => ({ ...prev, [stepId] : <SkipBadge title='Skip' /> }))
        }
    }

    return (
        <WindowContainer>
            <Loading loading={loading} />
            <AutomatedTestHeader
                saved={saved}
                testCasePath={testCasePath}
                isRunning={testRunning?.isRunning()}
                runTestSuite={runTestSuite}
                saveTestCase={saveTestCase}
                abortRunningTask={abortRunningTask}
            />

            <SplitWrapper cursor='row-resize' direction='horizontal' defaultSizes={[20, 80]}>
                <FunctionSidePanel>
                    <AutomatedTestCaseDetails
                        automatedTestCase={automatedTestCase}
                        handleInputChange={handleInputChange}
                    />

                    <AutomatedTestVariables automatedTestCase={automatedTestCase} updateSession={updateSession}/>

                    <FunctionalStepList
                        stepList={automatedTestCase.steps}
                        handleDragDropStep={handleDragDropStep}
                        listBadgesStatus={listBadgesStatus}
                        handleCursorChange={handleCursorChange}
                        actionsAddStep={actionsAddStep}
                        addStep={addStep}
                        cursor={cursor}
                    />
                </FunctionSidePanel>

               <div>
                   {automatedTestStep ?
                       <SplitWrapper
                           cursor='col-resize'
                           direction='vertical'
                           defaultSizes={[10, 50, 40]}
                       >
                        <StepHeader
                            automatedTestStep={automatedTestStep}
                            isRunning={testRunning?.isRunning()}
                            handleTypeChange={handleTypeChange}
                            runStep={runStep}
                            moveStep={moveStep}
                            toggleStep={toggleStep}
                            removeStep={removeStep}
                            load={load}
                        />

                        {automatedTestStep &&
                            <MonacoContainer
                                tabId={tabId}
                                layoutId={layoutId}
                                defaultValue={getDefaultValueForStep(automatedTestStep)}
                                modelInstance={automatedTestStep.modelId}
                                lang={automatedTestStep.child?.type === 'AssessmentSql' ? 'sql' : 'xml'}
                                onChangeContent={() => updateSession(() => {
                                })}
                                defaultActions={monacoActions}
                                readOnly={
                                    automatedTestStep.child?.type === 'ActionSoap' &&
                                    !!(automatedTestStep.child as AutomatedTestActionSoap).dataFileName
                                }
                            />
                        }

                        <Tabs
                            tabs={tabsResult}
                            running={isRunning}
                        />
                    </SplitWrapper>
                    :
                    <span>The list of steps is empty</span> }
               </div>
            </SplitWrapper>

            <ModalConfirm />
        </WindowContainer>
    );
};
FunctionalTestTab.defaultProps = {
    automatedTestService: defaultAutomatedTestService
}
export default FunctionalTestTab;
