import produce, {Draft} from 'immer';
import React, {useEffect, useState} from 'react';
import {Options} from '../../components/general/inputText';
import {PanelTitle} from '../../components/general/sidebar/style';
import {defaultAutomatedTestService} from '../../lib/context';
import AutomatedTestSuite from '../../lib/domain/entities/automatedTestItems/AutomatedTestSuite';
import AutomatedTestService from '../../lib/services/automatedTestService';
import AutomatedTestBatchExecution from './automatedTestBatchExecution';
import AutomatedTestSuites from './automatedTestSuites';
import AutomatedTestTree from './automatedTestTree';
import Templates from "./templates";

interface FunctionTestPanelProps {
    automatedTestService: AutomatedTestService;
}

const FunctionTestPanel = ({automatedTestService}: FunctionTestPanelProps) => {
    const [testSuites, setTestSuites] = useState<AutomatedTestSuite[]>([]);
    const [testSuiteIds, setTestSuiteIds] = useState<Options[]>([]);

    useEffect(() => {
        fetchTestSuitesId();
    }, [testSuites]);

    const fetchTestSuitesId = async () => {
        const ids : string[] = await automatedTestService.getTestSuiteIds();
        setTestSuiteIds(ids.map( id => new Options(id, id)));
    }

    const updateTestSuite = (recipe: (draft: Draft<AutomatedTestSuite[]>) => void) => {
        setTestSuites(produce(testSuites, recipe));
    };

    return (
        <>
            <PanelTitle>Functional Test</PanelTitle>
            <AutomatedTestSuites
                testSuites={testSuites}
                updateTestSuite={updateTestSuite}
                setTestSuites={setTestSuites}
            />
            <AutomatedTestTree />
            <Templates />
            <AutomatedTestBatchExecution
                testSuiteIds={testSuiteIds}
                fetchTestSuitesId={fetchTestSuitesId}
            />
        </>
    );
};

FunctionTestPanel.defaultProps = {
    automatedTestService: defaultAutomatedTestService,
};

export default FunctionTestPanel;
