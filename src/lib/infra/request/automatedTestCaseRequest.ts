import { Type } from 'class-transformer';
import AutomatedTestStep from '../../domain/entities/automatedTestItems/automatedTestStep';
import AutomatedTestVariable from '../../domain/entities/automatedTestItems/automatedTestVariable';
import {AutomatedTestStepChildType} from "../../domain/entities/automatedTestItems/automatedTestStepChild";
import AutomatedTestMath from "../../domain/entities/automatedTestItems/automatedTestMath";
import AutomatedTask from '../../domain/entities/automatedTestItems/automatedTask';

export class AutomatedTestTreeFolderCreationRequest {
    public fPath: string = '';
}

export class AutomatedTestTreeMoveRequest {
    public originPath: string = '';
    public nodeName: string = '';
    public destinationPath?: string = '';
}

export class AutomatedTestCaseCreationRequest {
    public testCaseName: string = '';
    public parentPath: string = '';
}

export class AutomatedTestCaseCopyRequest {
    public parentPath: string = '';
    public sourceName: string = '';
    public targetName: string = '';
}

export class AutomatedTestCaseRequest {
    public testCasePath = '';
    public uuid = '';
    public id = '';
    public description = '';
    public name = '';
    public keyword = '';
    public tags: string[] = [];
    @Type(() => AutomatedTestVariable) public variables: AutomatedTestVariable[] = [];
    @Type(() => AutomatedTestStep) public steps: AutomatedTestStep[] = [];
}

export class AutomatedTestTemplateStepRequest {
    public templateStepPath = '';
    public uuid = '';
    public id = '';
    public child : AutomatedTestStepChildType = new AutomatedTestMath();
    public disabled = false;
    public modelId = 0;
    public level = 2;
}

export class AutomatedTestSuiteFileUpdateRequest {
    public testSuitePath: string = '';
    public testSuiteFile: string = '';
}

export class AutomatedTestSuiteCreationRequest {
    public testSuiteName: string = '';
}

export class AutomatedTestSuiteUpdateRequest {
    public testSuitePath: string = '';
    public testCaseId: string = '';
}

export class AutomatedTestSuiteReportRequest {
    testSuitePath = '';
    runningId = '';
    tasks: AutomatedTask[] = [];
}

