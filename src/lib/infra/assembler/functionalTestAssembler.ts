import AutomatedTestCase from '../../domain/entities/automatedTestItems/automatedTestCase';
import AutomatedTestResult from '../../domain/entities/automatedTestItems/automatedTestResult';
import {
    AutomatedTestCaseCopyRequest,
    AutomatedTestCaseCreationRequest,
    AutomatedTestCaseRequest,
    AutomatedTestTemplateStepRequest,
    AutomatedTestSuiteCreationRequest,
    AutomatedTestSuiteFileUpdateRequest,
    AutomatedTestSuiteUpdateRequest, AutomatedTestSuiteReportRequest
} from '../request/automatedTestCaseRequest';
import AutomatedTestStep from "../../domain/entities/automatedTestItems/automatedTestStep";

export const toAutomatedTestCaseCreationRequest = (
    testCaseName: string,
    parentPath: string,
): AutomatedTestCaseCreationRequest => {
    return { testCaseName: testCaseName, parentPath: parentPath };
};

export const toAutomatedTestCaseCopyRequest = (
    parentPath: string,
    sourceName: string,
    targetName: string
): AutomatedTestCaseCopyRequest => {
    return { parentPath: parentPath, sourceName: sourceName, targetName: targetName };
};

export const toAutomatedTestCaseRequest = (
    testCasePath: string,
    entity: AutomatedTestCase,
): AutomatedTestCaseRequest => {
    return {
        testCasePath: testCasePath,
        uuid: entity.uuid,
        id: entity.id,
        name: entity.name,
        description: entity.description,
        keyword: entity.keyword,
        tags: entity.tags,
        steps: entity.steps,
        variables: entity.variables
    };
};

export const toAutomatedTestTemplateStepRequest = (templateStepPath: string, automatedTestStep: AutomatedTestStep): AutomatedTestTemplateStepRequest => ({
    templateStepPath,
    uuid: automatedTestStep.uuid,
    id: automatedTestStep.id,
    child: automatedTestStep.child,
    disabled: automatedTestStep.disabled,
    modelId: automatedTestStep.modelId,
    level: automatedTestStep.level,
})

export const toAutomatedTestSuiteFileUpdateRequest = (
    testSuitePath: string,
    testSuiteFile: string
): AutomatedTestSuiteFileUpdateRequest => {
    return {
        testSuitePath: testSuitePath,
        testSuiteFile: testSuiteFile
    }
};

export const toAutomatedTestSuiteCreationRequest = (
    testSuiteName: string
): AutomatedTestSuiteCreationRequest => {
    return {
        testSuiteName: testSuiteName
    }
};

export const toAutomatedTestSuiteUpdateRequest = (
    testSuitePath: string,
    testCaseId: string
): AutomatedTestSuiteUpdateRequest => {
    return {
        testSuitePath: testSuitePath,
        testCaseId: testCaseId
    }
};

export const toAutomatedTestSuiteReportRequest = (
    testSuitePath: string,
    result: AutomatedTestResult
): AutomatedTestSuiteReportRequest => (
    {
        testSuitePath: testSuitePath,
        runningId: result.runningId,
        tasks: result.tasks,
    }
);
