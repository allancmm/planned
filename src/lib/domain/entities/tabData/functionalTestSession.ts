import { Type } from 'class-transformer';
import { EntityType } from '../../enums/entityType';
import AutomatedTestCase from '../automatedTestItems/automatedTestCase';
import AutomatedTestResult from '../automatedTestItems/automatedTestResult';
import { ITabData } from './iTabData';
import CloseTabData from './closeTabData';

export default class FunctionalTestSession extends ITabData implements CloseTabData {
    clazz: string = 'FunctionalTestSession';

    public testCaseName: string = '';
    public testCasePath: string = '';

    @Type(() => AutomatedTestCase)
    public automatedTestCase: AutomatedTestCase = new AutomatedTestCase();

    @Type(() => AutomatedTestResult)
    public testCaseResults: AutomatedTestResult[] = [];

    @Type(() => AutomatedTestResult)
    public allTestResult: AutomatedTestResult = new AutomatedTestResult();

    public cursor = 0;

    public isRunningAll = false;

    public isStepRan = false;

    public isAllRan = false;

    public saved: boolean = true;

    public isRunning = false;

    confirmOnClose = true;

    generateTabId(): string {
        return this.testCasePath;
    }

    getGuid(): string {
        return this.testCaseName;
    }

    getName(): string {
        return this.testCaseName;
    }

    getType(): EntityType {
        return '';
    }

    getExtra(): string {
        return `Functional Test - ${this.testCaseName}`;
    }
}
