import React, { useEffect, useState } from 'react';
import { Loading, SplitWrapper, useLoading, WindowContainer } from 'equisoft-design-ui-elements';
import produce, {Draft} from 'immer';
import {toast} from 'react-toastify';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA } from '../../../components/editor/tabs/tabReducerTypes';
import {defaultAutomatedTestService} from '../../../lib/context';
import AutomatedTestResult from '../../../lib/domain/entities/automatedTestItems/automatedTestResult';
import FunctionalTestSuiteSession from '../../../lib/domain/entities/tabData/functionalTestSuiteSession';
import AutomatedTestService from '../../../lib/services/automatedTestService';
import MonacoContainer from '../monaco/monaco';
import AutomatedTestHeader from './automatedTestHeader';
import { ResultMessageContainer } from './style';
import Tabs from "../../../components/general/customTab";
import ResultLogTab from "../functionalTest/components/resultTab";
import useModalConfirm from '../../../components/editor/tabs/useModalConfirm';

const MESSAGE_CONFIRM = 'Do you want to save the test suite before closing the tab?';

const renderPanel = (isRan: boolean, testSuiteResult: AutomatedTestResult, isRunning: boolean) => {
    if(isRan || isRunning) {
       return <ResultLogTab result={testSuiteResult} />;
    }
    return <ResultMessageContainer>Not executed yet</ResultMessageContainer>;
}

interface AutomatedTestSuiteTabProps {
    tabId: string;
    layoutId: number;
    automatedTestService: AutomatedTestService;
}

const FunctionalTestSuiteTab = ({ tabId, layoutId, automatedTestService }: AutomatedTestSuiteTabProps) => {
    const tab = useTabWithId(tabId);
    const dispatch = useTabActions();
    const { data } = tab;

    if (!(data instanceof FunctionalTestSuiteSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const [ loading, load ] = useLoading();
    const [ dataTestSuite, setDataTestSuite ] = useState('');
    const [ isShow, setIsShow ] = useState(false);
    const [ testRunning, setTestRunning ] = useState<AutomatedTestResult>();

    const fetchTestSuite = () => {
        load(async () => {
            setDataTestSuite(await automatedTestService.getTestSuiteFile(data.testSuitePath));
            setIsShow(true);
        })();
    };

    useEffect(() => {
        fetchTestSuite();
    }, []);

    useEffect(() => {
        setTestRunning(data.testSuiteResult);
    }, [data.testSuiteResult]);

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

    const saveTestSuite = load(async () => {
        const dataTestSuiteValue = tab.model[0]?.getValue() ?? '';
        await automatedTestService.updateTestSuiteFile(data.testSuitePath, dataTestSuiteValue);
        updateSession(() => {}, undefined, true);
        toast.success('Test Suite updated successfully');
    });

    const { ModalConfirm } = useModalConfirm(saveTestSuite, tabId, layoutId, MESSAGE_CONFIRM);

    const runTestSuite = load( async () => {
        updateSession((draft) => {
            draft.testSuiteResult = new AutomatedTestResult();
            draft.isRunning = true;
            draft.isRan = false;
        }, data, data.saved);
        await automatedTestService.runTestSuite(data.testSuitePath).then(updateTestSuite);
    });

    const generateReport = load( async () => {
        const url: string = await automatedTestService.generateTestSuiteReport(data.testSuitePath, data.testSuiteResult);
        toast.success('Report created successfully : ' + url);
        window.open(url, '_blank', );

    });

    const updateTestSuite = (resp: AutomatedTestResult) => {
        updateSession((draft) => {
            draft.testSuiteResult = resp;
            draft.isRunning = resp.isRunning();
            draft.isRan = resp.isFinished();
        }, data, data.saved);
    };

    const updateSession = (
        recipe: (draft: Draft<FunctionalTestSuiteSession>) => void,
        baseSession = data,
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

    const getRunning = async () => {
        if(testRunning){
            await automatedTestService.getRunning(testRunning.runningId).then(updateTestSuite);
        }
    };

    const abortRunningTask = load(async () => {
        if(testRunning){
            await automatedTestService.abortRunningTask(testRunning.runningId);
            updateSession((draft) => {
                draft.testSuiteResult = new AutomatedTestResult();
                draft.isRunning = false;
                draft.isRan = false;
            }, data, data.saved);
        }
    });

    return (
        <WindowContainer>
            <Loading loading={loading} />
            <AutomatedTestHeader
                tabId={tabId}
                saved={data.saved}
                testSuitePath={data.testSuitePath}
                isRunning={data.testSuiteResult?.isRunning()}
                hasResult={data.testSuiteResult?.isFinished()}
                abortRunningTask={abortRunningTask}
                runTestSuite={runTestSuite}
                saveTestSuite={saveTestSuite}
                generateReport={generateReport}
            />
            <SplitWrapper
                cursor='col-resize'
                direction='vertical'
                defaultSizes={[60, 40]}
            >
                <SplitWrapper cursor='col-resize' direction='vertical' defaultSizes={[100]}>
                    {isShow ? <MonacoContainer
                        tabId={tabId}
                        layoutId={layoutId}
                        modelInstance={0}
                        readOnly={false}
                        defaultValue={dataTestSuite}
                        onChangeContent={() => updateSession(() => {})}
                    /> : <span>Wait...</span>}
                </SplitWrapper>

                <Tabs
                    tabs={[{
                        label: 'Result',
                        panelContent: renderPanel(data.isRan, data.testSuiteResult, data.isRunning)
                    }]}
                    running={data.isRunning}
                />
            </SplitWrapper>

            <ModalConfirm />
        </WindowContainer>
    );
};

FunctionalTestSuiteTab.defaultProps = {
    automatedTestService: defaultAutomatedTestService,
};

export default FunctionalTestSuiteTab;
