import { EntityType } from '../../enums/entityType';
import AutomatedTestResult from '../automatedTestItems/automatedTestResult';
import { ITabData } from './iTabData';
import { Type } from "class-transformer";

export default class FunctionalTestSuiteResultTabSession extends ITabData {
    clazz: string = 'FunctionalTestSuiteResultTabSession';

    public executionId = '';
    public batchExecutionName: string = '';
    public runnableTestCases: string[] = [];
    public selectedTestSuite: string = '';

    @Type(() => AutomatedTestResult)
    public currentTestSuite: AutomatedTestResult | null = null;

    @Type(() => AutomatedTestResult)
    public testSuiteProcess: AutomatedTestResult[] = [];

    @Type(() => AutomatedTestResult)
    public testRunning: AutomatedTestResult | null = null;

    @Type(() => AutomatedTestResult)
    public testSuiteResults: AutomatedTestResult[] = [];

    public alreadyRender: boolean = false;

    generateTabId(): string {
        return this.getName();
    }

    getExtra(): string {
        return '';
    }

    getGuid(): string {
        return this.getName();
    }

    getName(): string {
        return this.batchExecutionName;
    }

    getType(): EntityType {
        return '';
    }

}