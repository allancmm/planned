import { Type } from 'class-transformer';
import { EntityType } from '../../enums/entityType';
import AutomatedTestResult from '../automatedTestItems/automatedTestResult';
import AutomatedTestSuite from '../automatedTestItems/AutomatedTestSuite';
import { ITabData } from './iTabData';
import CloseTabData from './closeTabData';

export default class FunctionalTestSuiteSession extends ITabData implements CloseTabData {
    clazz: string = 'FunctionalTestSuiteSession';

    public testSuiteName: string = '';
    public testSuitePath: string = '';

    @Type(() => AutomatedTestSuite)
    public automatedTestSuite: AutomatedTestSuite = new AutomatedTestSuite();

    @Type(() => AutomatedTestResult)
    public testSuiteResult: AutomatedTestResult = new AutomatedTestResult();

    public saved = true;
    public isRunning = false;
    public isRan = false;

    confirmOnClose = true;

    generateTabId(): string {
        return this.testSuiteName;
    }

    getGuid(): string {
        return this.testSuiteName;
    }

    getName(): string {
        return this.testSuiteName;
    }

    getType(): EntityType {
        return 'FUNCTIONAL_TEST_SUITE';
    }

    getExtra(): string {
        return `Functional Test Suite - ${this.testSuiteName}`;
    }
}
