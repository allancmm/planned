import React, {ChangeEvent, MouseEvent, useEffect, useState} from 'react';
import { Button } from "@equisoft/design-elements-react";
import { CollapseContainer, useLoading, Loading } from 'equisoft-design-ui-elements';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import InputText, {Options} from '../../../components/general/inputText';
import { defaultAutomatedTestService } from '../../../lib/context';
import FunctionalTestSuiteResultTabSession from '../../../lib/domain/entities/tabData/functionalTestSuiteResultTabSession';
import AutomatedTestService from '../../../lib/services/automatedTestService';
import { v4 as uuid } from "uuid";
import { BatchExecutionContainer, UploadButtonContainer } from './style';

interface AutomatedTestBatchExecutionProps {
    automatedTestService: AutomatedTestService,
    testSuiteIds: Options[],
    fetchTestSuitesId(): void;
}

const AutomatedTestBatchExecution = ({testSuiteIds, fetchTestSuitesId, automatedTestService}: AutomatedTestBatchExecutionProps) => {
    const [selectedTestSuite, setSelectedTestSuite] = useState<string>();
    const [file, setFile]  = useState<Blob>();
    const [selectedFileName, setSelectedFileName] = useState<string>();
    const dispatch = useTabActions();
    const [loading, load] = useLoading();

    useEffect(() => {
        fetchTestSuitesId();
    }, []);

    const fetchUploadFile = load(automatedTestService.uploadFile);

    const uploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(file && selectedTestSuite && selectedFileName) {
            const testSuitesFileNames = await fetchUploadFile(file, selectedTestSuite);
            openTestSuiteResults(testSuitesFileNames, selectedTestSuite, selectedFileName);
        }
    }

    const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const f = e.target.files[0];
            setFile(f);
            setSelectedFileName(f.name)
        }
    };

    const openTestSuiteResults = (runnableTestSuites: string[], testSuite: string, fileName: string) => {
        const session = new FunctionalTestSuiteResultTabSession();
        session.executionId = uuid();
        session.runnableTestCases = runnableTestSuites;
        session.selectedTestSuite = testSuite;
        session.batchExecutionName = fileName;
        dispatch({ type: OPEN, payload: { data: session, reloadContent: true  } });
    };

    return (
        <CollapseContainer title='Test Suite Batch Execution'>
            <>
                <Loading loading={loading} />
                <BatchExecutionContainer>
                    <InputText
                        label='Test Suites'
                        type='select'
                        options={testSuiteIds}
                        onChange={(e: Options) => setSelectedTestSuite(e.value)}
                        classNameInput='custom-style'
                    />

                    <InputText
                        label='File'
                        type='file'
                        onChange={onFileSelect}
                        classNameInput='custom-style'
                    />

                    <UploadButtonContainer>
                        <Button buttonType="primary" type="button" onClick={uploadFile} disabled={!file || !selectedTestSuite}>
                            Upload Config
                        </Button>
                    </UploadButtonContainer>
                </BatchExecutionContainer>
            </>
        </CollapseContainer>
    );
}

AutomatedTestBatchExecution.defaultProps = {
    automatedTestService: defaultAutomatedTestService,
};

export default AutomatedTestBatchExecution;