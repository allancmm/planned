import React, { useEffect, useMemo, useState } from 'react';
import produce, { Draft } from 'immer';
import {toast} from 'react-toastify';
import { useLoading, Loading } from "equisoft-design-ui-elements";
import {useTabActions, useTabWithId} from '../../../components/editor/tabs/tabContext';
import {EDIT_TAB_DATA} from '../../../components/editor/tabs/tabReducerTypes';
import {defaultAutomatedTestService} from '../../../lib/context';
import AutomatedTestResult from '../../../lib/domain/entities/automatedTestItems/automatedTestResult';
import FunctionalTestSuiteResultTabSession from '../../../lib/domain/entities/tabData/functionalTestSuiteResultTabSession';
import AutomatedTestService from '../../../lib/services/automatedTestService';
import AutomatedTestResultOutput from '../functionalTestSuiteTab/automatedTestResult/automatedTestResultOutput';
import { ResultMessageContainer } from '../functionalTestSuiteTab/style';
import {AutomatedTestResultOutputContainer, ResultContainer} from './style';

interface FunctionalTestSuiteResultsTabProps {
    tabId: string;
    automatedTestService: AutomatedTestService;
}

const FunctionalTestSuiteResultsTab = ({ tabId, automatedTestService }: FunctionalTestSuiteResultsTabProps) => {
    const tab = useTabWithId(tabId);
    const { data } = tab;
    const dispatch = useTabActions();

    if (!(data instanceof FunctionalTestSuiteResultTabSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const [loading, load] = useLoading();

    const updateSession = (recipe: (draft: Draft<FunctionalTestSuiteResultTabSession>) => void) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, recipe),
            },
        });
    };

    const { testSuiteProcess,
            testRunning,
            currentTestSuite,
            selectedTestSuite,
            runnableTestCases,
            testSuiteResults,
            alreadyRender,
            executionId } = data;

    const [index, setIndex] = useState<number>(0);

    const fetchExecuteBatch = load(automatedTestService.executeBatch);
    const ableToRender = useMemo(() => index === ( testSuiteResults.length - 1) || alreadyRender,
        [index, testSuiteResults, alreadyRender]);
    const fetchRunning = load(automatedTestService.getRunning);

    useEffect(() => {
        if(!alreadyRender) {
            fetchTestResults();
        }
    },[executionId]);

    useEffect(() => {
        let interval: any;
        if(!alreadyRender) {
            if (testRunning?.isRunning()) {
                interval = setInterval(getRunning, 1000);
            } else {
                clearInterval(interval);
                if (testRunning?.isFinished()) {
                    automatedTestService.clearRunningTestByRunningId(testRunning?.runningId);
                    const i = index + 1;
                    if(i < testSuiteResults.length) {
                        setIndex(i);
                        updateSession((draft) => {
                            draft.testSuiteProcess.push(testRunning);
                            draft.testRunning = testSuiteResults[i];
                        });
                    }

                    if(i === testSuiteResults.length) {
                        updateSession((draft) => {
                            draft.testSuiteProcess.push(testRunning);
                            draft.testRunning = testSuiteResults[i];
                            draft.alreadyRender = true;
                        })
                    }
                }
            }
        }
        return () => clearInterval(interval);
    }, [testRunning]);


    useEffect(() => {
        if(currentTestSuite != null && !alreadyRender) {
            updateSession((draft) => {
                draft.testRunning = currentTestSuite;
            });
        }
    }, [currentTestSuite]);

    const fetchTestResults = async () => {
        const results = await fetchExecuteBatch(selectedTestSuite, runnableTestCases[0]);
        setIndex(0);
        updateSession((draft) => {
            draft.testSuiteProcess = [];
            draft.testRunning = results[0];
            draft.testSuiteResults = results;
        });
    }

    const getRunning = async () => {
        if(testRunning && testRunning.isRunning()){
            fetchRunning(testRunning.runningId)
                .then(updateTestSuite)
                .catch(() => {
                    updateSession((draft) => {
                        draft.testRunning = new AutomatedTestResult();
                        draft.testRunning.status = 'FAIL';
                    })
                });
        }
    };

    const updateTestSuite = (resp: AutomatedTestResult) => {
        updateSession((draft) => {
            draft.currentTestSuite = resp;
        });
    };

    return (
        <>
            <Loading loading={loading || !ableToRender} />
            <ResultContainer>
                {testSuiteProcess.length > 0 ?
                    testSuiteProcess.map((r, key) =>
                        <AutomatedTestResultOutputContainer key={r.runningId}>
                            <span>RESULT: {key + 1} - {r.runningId}</span>
                            <AutomatedTestResultOutput result={r}/>
                        </AutomatedTestResultOutputContainer>)
                    :
                    <ResultMessageContainer>Running....</ResultMessageContainer>
                }
            </ResultContainer>
        </>
    )
};

FunctionalTestSuiteResultsTab.defaultProps = {
    automatedTestService: defaultAutomatedTestService,
};

export default FunctionalTestSuiteResultsTab;