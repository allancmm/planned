import { ITabData } from './iTabData';
import { EntityType } from '../../enums/entityType';
import TestResult from '../testResult';
import { Type } from 'class-transformer';

export default class TestReport extends ITabData {
    clazz: string = 'TestReport';

    @Type(() => TestResult) public report: TestResult = new TestResult();

    entityType : EntityType = '';
    unitTestGuid: string = '';
    unitTestReportGuid = '';
    runBy = '';
    runDate = new Date();

    generateTabId(): string {
        return `Report - ${this.report.type} - ${this.report.name} - ${this.unitTestReportGuid}`;
    }
    getGuid(): string {
        return `Report - ${this.report.type} - ${this.report.name}`;
    }
    getName(): string {
        return 'Test Result - ' + this.report.name;
    }
    getType(): EntityType {
        return this.entityType;
    }
    getExtra(): string {
        return 'Unit Tests';
    }
}
