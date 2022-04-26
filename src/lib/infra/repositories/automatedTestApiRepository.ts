import {TreeItem} from 'react-sortable-tree';
import AutomatedTestCase from '../../domain/entities/automatedTestItems/automatedTestCase';
import AutomatedTestResult from '../../domain/entities/automatedTestItems/automatedTestResult';
import AutomatedTestSuite from '../../domain/entities/automatedTestItems/AutomatedTestSuite';
import {ReportForListResponse} from '../../domain/entities/automatedTestItems/reportForListResponse';
import ActionDefinition from '../../domain/entities/automatedTestItems/testDefinitions/actionDefinition';
import {AutomatedTestTreeNode} from '../../domain/entities/automatedTestItems/tree/automatedTestTreeNode';
import AutomatedTestRepository from '../../domain/repositories/automatedTestRepository';
import LongJob from '../../domain/util/longJob';
import {
    toAutomatedTestCaseCopyRequest,
    toAutomatedTestCaseCreationRequest,
    toAutomatedTestCaseRequest,
    toAutomatedTestTemplateStepRequest,
    toAutomatedTestSuiteCreationRequest,
    toAutomatedTestSuiteFileUpdateRequest,
    toAutomatedTestSuiteUpdateRequest, toAutomatedTestSuiteReportRequest
} from '../assembler/functionalTestAssembler';
import * as TreeItemAssembler from '../assembler/treeItemAssembler';
import { ApiGateway } from "../config/apiGateway";
import {HeaderType} from '../config/axiosApiGateway';
import {
    AutomatedTestCaseCopyRequest,
    AutomatedTestCaseCreationRequest,
    AutomatedTestCaseRequest,
    AutomatedTestSuiteCreationRequest,
    AutomatedTestSuiteFileUpdateRequest, AutomatedTestSuiteReportRequest,
    AutomatedTestSuiteUpdateRequest,
    AutomatedTestTemplateStepRequest,
    AutomatedTestTreeFolderCreationRequest,
    AutomatedTestTreeMoveRequest
} from '../request/automatedTestCaseRequest';
import AutomatedTestTreeTemplateStep from "../../domain/entities/automatedTestItems/tree/automatedTestTreeTemplateStep";
import AutomatedTestStep from "../../domain/entities/automatedTestItems/automatedTestStep";

export default class AutomatedTestApiRepository implements AutomatedTestRepository {
    constructor(private api: ApiGateway) {}

    /* GETTERS */

    getAutomatedTestSuites = (): Promise<AutomatedTestSuite[]> => this.api.getArray(`/functional-tests/testSuites`);

    getAutomatedTestTree = (): Promise<AutomatedTestTreeNode> => this.api.get(`/functional-tests/all`, { outType: AutomatedTestTreeNode });

    getAutomatedTestTreeItems = async (): Promise<TreeItem> => TreeItemAssembler.fromAutomatedTestTreeNode(await this.getAutomatedTestTree());

    getTestCase = (testCasePath: string): Promise<AutomatedTestCase> =>
        this.api.get(`/functional-tests/testcase?testCasePath=${testCasePath}`, {
            outType: AutomatedTestCase,
        });

    getTestSuiteFile = (testSuitePath: string): Promise<string> => this.api.get(`/functional-tests/testSuiteFile?testSuitePath=${testSuitePath}`);

    getActionDefinitions = (): Promise<ActionDefinition[]> => this.api.getArray(`/functional-tests/actionDefinitions`);

    getAllTemplateSteps = async () : Promise<AutomatedTestTreeTemplateStep> =>
        this.api.get(`/functional-tests/allTemplateSteps`, { outType: AutomatedTestTreeTemplateStep });

    /* RUNNING */

    runTestCase = (testCasePath: string): Promise<AutomatedTestResult> =>
        this.api.post(`/functional-tests/run?testCasePath=${testCasePath}`, null, {
            outType: AutomatedTestResult,
        });

    runStep = (testCasePath: string, stepId: string): Promise<AutomatedTestResult> =>
        this.api.post(`/functional-tests/runStep?testCasePath=${testCasePath}&stepId=${stepId}`, null, {
            outType: AutomatedTestResult,
        });

    getRunning = (runningId: string): Promise<AutomatedTestResult> =>
        this.api.get(`/functional-tests/running/${runningId}`, {
            outType: AutomatedTestResult,
        });

    runTestSuite = (testSuitePath: string): Promise<AutomatedTestResult> =>
        this.api.post(`/functional-tests/runTestSuite?testSuitePath=${testSuitePath}`, null, {
            outType: AutomatedTestResult,
        });

    abortRunningTask = (runningId: string): Promise<void> => this.api.delete(`/functional-tests/running/${runningId}`);

    generateTestSuiteReport = (testSuitePath: string, result: AutomatedTestResult): Promise<string> =>
        this.api.post(`/functional-tests/generateTestSuiteReport`, toAutomatedTestSuiteReportRequest(testSuitePath, result),{
            inType: AutomatedTestSuiteReportRequest,
        });

    getReportsByTestSuite = async (testSuiteName: string): Promise<ReportForListResponse[]> => {
        return this.api.getArray(`/functional-tests/testsuite/reports?testSuiteName=${testSuiteName}`, { outType: ReportForListResponse });
    }

    downloadReport = async (longJob: LongJob) => {
        const reportZip = await this.api.getBlobData(`/functional-tests/testsuite/report?reportFolder=${longJob.resultData.reportFolder}`);
        const downloadURL = window.URL.createObjectURL(reportZip);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.setAttribute('download', `${longJob.resultData.reportFolder}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    /* OPERATIONS */

    createFolder = (fPath: string): Promise<void> =>
        this.api.post(`/functional-tests/folder`,{ fPath: fPath },{
            inType: AutomatedTestTreeFolderCreationRequest,
        });

    createTestCase = (testCaseName: string, pathParent: string): Promise<void> =>
        this.api.post(`/functional-tests/testcase`, toAutomatedTestCaseCreationRequest(testCaseName, pathParent),{
            inType: AutomatedTestCaseCreationRequest,
        });

    copyTestCase = (pathParent: string, sourceName: string, targetName: string): Promise<void> =>
        this.api.post(`/functional-tests/testcase/copy`, toAutomatedTestCaseCopyRequest(pathParent, sourceName, targetName),{
            inType: AutomatedTestCaseCopyRequest,
        });

    moveNode = (originPath: string, nodeName: string, destinationPath?: string): Promise<string> =>
        this.api.post(`/functional-tests/move`,{
            originPath: originPath,
            nodeName: nodeName,
            destinationPath: destinationPath
        },{
            inType: AutomatedTestTreeMoveRequest,
        });

    deleteTestCase = (testCasePath: string, isFolder: boolean): Promise<void> =>
        this.api.delete(`/functional-tests/testcase/delete?testCasePath=${testCasePath}&isFolder=${isFolder}`);

    saveTestCase = (testCasePath: string, automatedTestCase: AutomatedTestCase): Promise<AutomatedTestCase> =>
        this.api.put(`/functional-tests/testcase`, toAutomatedTestCaseRequest(testCasePath, automatedTestCase), {
            inType: AutomatedTestCaseRequest,
            outType: AutomatedTestCase,
        });

    saveTemplateStep = async (templateStepPath: string, automatedTestStep: AutomatedTestStep): Promise<void> =>
        this.api.put(`/functional-tests/templateStep`, toAutomatedTestTemplateStepRequest(templateStepPath, automatedTestStep),
            { inType: AutomatedTestTemplateStepRequest });

    createTemplateStep = async (templateStepPath: string, automatedTestStep: AutomatedTestStep): Promise<void> =>
        this.api.post(`/functional-tests/templateStep`, toAutomatedTestTemplateStepRequest(templateStepPath, automatedTestStep),
            { inType: AutomatedTestTemplateStepRequest });

    deleteTemplate = (templatePath: string, isFolder: boolean): Promise<void> =>
        this.api.delete(`/functional-tests/templateStep/delete?templatePath=${templatePath}&isFolder=${isFolder}`);

    updateTestSuiteFile = (testSuitePath: string, testSuiteFile: string): Promise<void> =>
        this.api.post(`/functional-tests/testsuite/updateFile`, toAutomatedTestSuiteFileUpdateRequest(testSuitePath, testSuiteFile), {
            inType: AutomatedTestSuiteFileUpdateRequest
        });

    createTestSuite = (testSuiteName: string): Promise<void> =>
        this.api.post(`/functional-tests/testsuite/create`, toAutomatedTestSuiteCreationRequest(testSuiteName), {
            inType: AutomatedTestSuiteCreationRequest
        });

    updateTestSuite = (testSuitePath: string, testCaseId: string): Promise<void> =>
        this.api.post(`/functional-tests/testsuite/update`, toAutomatedTestSuiteUpdateRequest(testSuitePath, testCaseId), {
            inType: AutomatedTestSuiteUpdateRequest
        });

    clearRunningTestByRunningId = (runningId: string): Promise<void> => this.api.post(`/functional-tests/clearRunningTests?runningId=${runningId}`);

    getTestSuiteIds = async (): Promise<string[]> => {
        return this.api.getArray(`/functional-tests/testsuite/ids`)
    }

    deleteTestSuite = (testSuitePath: string): Promise<void> =>
        this.api.delete(`/functional-tests/testsuite/delete?testSuitePath=${testSuitePath}`);

    uploadFile = async (f: Blob, selectedTestSuite: string): Promise<string[]> => {
        return this.api.postReturnArray(
            `/functional-tests/testsuite/upload?testSuite=${selectedTestSuite}`,
            f,
            undefined,
            'application/octet-stream' as HeaderType);
    }

    executeBatch = async(testSuite: string, fileName: string): Promise<AutomatedTestResult[]> =>
        this.api.getArray(`/functional-tests/testsuite/runBatch?testSuite=${testSuite}&file=${fileName}`,
            { outType: AutomatedTestResult });
}