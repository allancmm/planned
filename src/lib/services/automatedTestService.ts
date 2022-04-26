import {TreeItem} from 'react-sortable-tree';
import AutomatedTestCase from '../domain/entities/automatedTestItems/automatedTestCase';
import AutomatedTestResult from '../domain/entities/automatedTestItems/automatedTestResult';
import AutomatedTestSuite from '../domain/entities/automatedTestItems/AutomatedTestSuite';
import {ReportForListResponse} from '../domain/entities/automatedTestItems/reportForListResponse';
import ActionDefinition from '../domain/entities/automatedTestItems/testDefinitions/actionDefinition';
import AutomatedTestRepository from '../domain/repositories/automatedTestRepository';
import AutomatedTestStep from "../domain/entities/automatedTestItems/automatedTestStep";
import AutomatedTestTreeTemplateStep from "../domain/entities/automatedTestItems/tree/automatedTestTreeTemplateStep";
import LongJob from '../domain/util/longJob';

export default class AutomatedTestService {
    constructor(private automatedTestRepository: AutomatedTestRepository) {}

    /* GETTERS */

    getAutomatedTestSuites = async (): Promise<AutomatedTestSuite[]> => this.automatedTestRepository.getAutomatedTestSuites();

    getAutomatedTestTreeItems = async (): Promise<TreeItem> => this.automatedTestRepository.getAutomatedTestTreeItems();

    getTestCase = async (testCasePath: string): Promise<AutomatedTestCase> => this.automatedTestRepository.getTestCase(testCasePath);

    getTestSuiteFile = (testSuitePath: string): Promise<string> => this.automatedTestRepository.getTestSuiteFile(testSuitePath);

    getActionDefinitions = (): Promise<ActionDefinition[]> => this.automatedTestRepository.getActionDefinitions();

    getAllTemplateSteps = async () : Promise<AutomatedTestTreeTemplateStep> => this.automatedTestRepository.getAllTemplateSteps();

    /* RUNNING */

    runTestCase = async (testCasePath: string): Promise<AutomatedTestResult> => this.automatedTestRepository.runTestCase(testCasePath);

    runStep = async (testCasePath: string, stepId: string): Promise<AutomatedTestResult> => this.automatedTestRepository.runStep(testCasePath, stepId);

    getRunning = async (runningId: string): Promise<AutomatedTestResult> => this.automatedTestRepository.getRunning(runningId);

    runTestSuite = async (testSuitePath: string): Promise<AutomatedTestResult> => this.automatedTestRepository.runTestSuite(testSuitePath);

    generateTestSuiteReport = async (testSuitePath: string, result: AutomatedTestResult): Promise<string> =>
        this.automatedTestRepository.generateTestSuiteReport(testSuitePath, result);

    getReportsByTestSuite = async (testSuiteName: string): Promise<ReportForListResponse[]> =>
        this.automatedTestRepository.getReportsByTestSuite(testSuiteName);

    downloadReport = (longJob: LongJob) => this.automatedTestRepository.downloadReport(longJob);

    abortRunningTask = async (runningTaskId: string): Promise<void> => this.automatedTestRepository.abortRunningTask(runningTaskId);

    /* OPERATIONS */

    createFolder = async (fPath: string): Promise<void> => this.automatedTestRepository.createFolder(fPath);

    createTestCase = async (testCaseName: string, pathParent: string): Promise<void> => this.automatedTestRepository.createTestCase(testCaseName, pathParent);

    copyTestCase = async (pathParent: string, sourceName: string, targetName: string): Promise<void> =>
        this.automatedTestRepository.copyTestCase(pathParent, sourceName, targetName);

    moveNode = async (originPath: string, nodeName: string, destinationPath?: string): Promise<string> =>
        this.automatedTestRepository.moveNode(originPath, nodeName, destinationPath);

    deleteTestCase = async (testCasePath: string, isFolder: boolean): Promise<void> => this.automatedTestRepository.deleteTestCase(testCasePath, isFolder);

    saveTestCase = async (testCasePath: string, automatedTestCase: AutomatedTestCase): Promise<AutomatedTestCase> =>
        this.automatedTestRepository.saveTestCase(testCasePath, automatedTestCase);

    createTemplateStep = async (templateStepPath: string, automatedTestStep: AutomatedTestStep): Promise<void> =>
        this.automatedTestRepository.createTemplateStep(templateStepPath, automatedTestStep);

    saveTemplateStep = async (templateStepPath: string, automatedTestStep: AutomatedTestStep): Promise<void> =>
        this.automatedTestRepository.saveTemplateStep(templateStepPath, automatedTestStep);

    deleteTemplate = async (templatePath: string, isFolder: boolean): Promise<void> =>
        this.automatedTestRepository.deleteTemplate(templatePath, isFolder);

    updateTestSuiteFile = async (testSuitePath: string, testSuiteFile: string): Promise<void> =>
        this.automatedTestRepository.updateTestSuiteFile(testSuitePath, testSuiteFile);

    createTestSuite = async (testSuiteName: string): Promise<void> => this.automatedTestRepository.createTestSuite(testSuiteName);

    updateTestSuite = async (testSuitePath: string, testCaseId: string): Promise<void> =>
        this.automatedTestRepository.updateTestSuite(testSuitePath, testCaseId);

    getTestSuiteIds = async () : Promise<string[]> => this.automatedTestRepository.getTestSuiteIds();

    deleteTestSuite = async (testSuitePath: string): Promise<void> =>
    this.automatedTestRepository.deleteTestSuite(testSuitePath);

    uploadFile = async (f: Blob, selectedTestSuite: string): Promise<string[]> => this.automatedTestRepository.uploadFile(f, selectedTestSuite);

    executeBatch = async (testSuite: string, file: string): Promise<AutomatedTestResult[]> => this.automatedTestRepository.executeBatch(testSuite, file);

    clearRunningTestByRunningId = (runningId: string): Promise<void> => this.automatedTestRepository.clearRunningTestByRunningId(runningId);
}
