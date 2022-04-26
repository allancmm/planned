import {TreeItem} from 'react-sortable-tree';
import AutomatedTestCase from '../entities/automatedTestItems/automatedTestCase';
import AutomatedTestResult from '../entities/automatedTestItems/automatedTestResult';
import AutomatedTestSuite from '../entities/automatedTestItems/AutomatedTestSuite';
import {ReportForListResponse} from '../entities/automatedTestItems/reportForListResponse';
import ActionDefinition from '../entities/automatedTestItems/testDefinitions/actionDefinition';
import AutomatedTestTreeTemplateStep from "../entities/automatedTestItems/tree/automatedTestTreeTemplateStep";
import AutomatedTestStep from "../entities/automatedTestItems/automatedTestStep";
import LongJob from '../util/longJob';

export default interface AutomatedTestRepository {

    getAutomatedTestSuites(): Promise<AutomatedTestSuite[]>;
    getAutomatedTestTreeItems(): Promise<TreeItem>;
    getTestCase(testCasePath: string): Promise<AutomatedTestCase>;
    getTestSuiteFile(testSuitePath: string): Promise<string>;
    getActionDefinitions(): Promise<ActionDefinition[]>;
    getAllTemplateSteps() : Promise<AutomatedTestTreeTemplateStep>;
    runTestCase(testCasePath: string): Promise<AutomatedTestResult>;
    runStep(testCasePath: string, stepId: string): Promise<AutomatedTestResult>;
    getRunning(runningId: string): Promise<AutomatedTestResult>;
    runTestSuite(testSuitePath: string): Promise<AutomatedTestResult>;
    abortRunningTask(runningId: string): Promise<void>;
    generateTestSuiteReport(testSuitePath: string, result: AutomatedTestResult): Promise<string>;
    getReportsByTestSuite(testSuiteName: string): Promise<ReportForListResponse[]>;
    downloadReport(longJob: LongJob): void;
    createFolder(fPath: string): Promise<void>;
    createTestCase(testCaseName: string, pathParent: string): Promise<void>;
    copyTestCase(pathParent: string, sourceName: string, targetName: string): Promise<void>;
    moveNode(originPath: string, nodeName: string, destinationPath?: string): Promise<string>;
    deleteTestCase(testCasePath: string, isFolder: boolean): Promise<void>;
    saveTestCase(testCasePath: string, automatedTestCase: AutomatedTestCase): Promise<AutomatedTestCase>;
    saveTemplateStep(templateStepPath: string, automatedTestStep: AutomatedTestStep): Promise<void>;
    createTemplateStep(templateStepPath: string, automatedTestStep: AutomatedTestStep): Promise<void>;
    deleteTemplate(templatePath: string, isFolder: boolean): Promise<void>;
    updateTestSuiteFile(testSuitePath: string, testSuiteFile: string): Promise<void>;
    createTestSuite(testSuiteName: string): Promise<void>;
    updateTestSuite(testSuitePath: string, testCaseId: string): Promise<void>;
    getTestSuiteIds(): Promise<string[]>;
    deleteTestSuite(testSuitePath: string): Promise<void>;
    uploadFile(f: Blob, selectedTestSuite: string): Promise<string[]>;
    executeBatch(testSuite: string, file: string): Promise<AutomatedTestResult[]>;
    clearRunningTestByRunningId(runningId: string): Promise<void>;
}