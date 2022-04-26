import CreateTestCase from '../../domain/entities/createTestCase';
import CreateTestSuite from '../../domain/entities/createTestSuite';
import InterpreterResult from '../../domain/entities/interpreterResult';
import {RunTestSuiteRequest} from '../../domain/entities/runTestSuiteRequest';
import TestCase from '../../domain/entities/testCase';
import TestResult from '../../domain/entities/testResult';
import TestSuite from '../../domain/entities/testSuite';
import TestTypes from '../../domain/entities/testTypes';
import {EntityType} from '../../domain/enums/entityType';
import UnitTestRepository from '../../domain/repositories/unitTestRepository';
import {ApiGateway} from '../config/apiGateway';
import {TestReportResult} from "../../domain/entities/testReportResult";
import TestDataResultDto from '../../domain/entities/testDataResultDto';
import { ConvertMockRequest } from '../../domain/entities/convertMockRequest';
import { TestDataResultRequest } from '../../domain/entities/testDataResultRequest';
import AssessmentDto from '../../domain/entities/assessmentDto';
import MockDto from '../../domain/entities/mockDto';

export default class UnitTestApiRepository implements UnitTestRepository {
    constructor(private api: ApiGateway) {}

    async getTestTypesWithCoverage(): Promise<TestTypes[]> {
        return this.api.getArray('/unit-tests/', { outType: TestTypes });
    }

    async getTestTypes(): Promise<EntityType[]> {
        return this.api.getArray('/unit-tests/entityTypes');
    }

    async supportsTesting(entityType: string): Promise<boolean> {
        return this.api.get(`/unit-tests/${entityType}`);
    }

    async getTestSuites(entityType: string): Promise<TestSuite[]> {
        return this.api.getArray(`/unit-tests/${entityType}/suites`, { outType: TestSuite });
    }

    async getAllTestSuitesTags(): Promise<string[]> {
        return this.api.getArray(`/unit-tests/suites/tags`);
    }

    async getTestCases(entityType: string, unitTestGuid: string): Promise<TestCase[]> {
        return this.api.getArray(`/unit-tests/${entityType}/suites/${unitTestGuid}/cases`, { outType: TestCase });
    }

    async loadTestCase(entityType: string, unitTestGuid: string, caseName: string): Promise<TestCase> {
        return this.api.get(`/unit-tests/${entityType}/suites/${unitTestGuid}/cases/${caseName}`, {
            outType: TestCase,
        });
    }

    async loadTestSuite(entityType: string, unitTestGuid: string): Promise<TestSuite> {
        return this.api.get(`/unit-tests/${entityType}/suites/${unitTestGuid}`, { outType: TestSuite });
    }

    async createTestSuite(entityType: string, ruleGuid: string, ruleName: string): Promise<string> {
        return this.api.put(`/unit-tests/${entityType}/suites`, { ruleGuid, ruleName }, { inType: CreateTestSuite });
    }

    async createTestCase(name: string, entityType: string, unitTestGuid: string): Promise<void> {
        return this.api.put(`/unit-tests/${entityType}/suites/${unitTestGuid}/cases/${name}`, null, {
            inType: CreateTestCase,
        });
    }

    async saveTestCase(
        name: string,
        entityType: string,
        unitTestGuid: string,
        testCaseData: CreateTestCase,
    ): Promise<void> {
        return this.api.put(`/unit-tests/${entityType}/suites/${unitTestGuid}/cases/${name}`, testCaseData, {
            inType: CreateTestCase,
        });
    }

    async runAllTests(): Promise<TestResult> {
        return this.api.post(`/unit-tests/`, null, { outType: TestResult });
    }

    async runAllTestsWithTags(runTestSuiteRequest: RunTestSuiteRequest): Promise<TestResult> {
        return this.api.post(`/unit-tests/`, runTestSuiteRequest, { inType: RunTestSuiteRequest, outType: TestResult });
    }

    async runTestSuite(entityType: string, unitTestGuid: string): Promise<TestResult> {
        return this.api.post(`/unit-tests/${entityType}/suites/${unitTestGuid}`, null, { outType: TestResult });
    }

    async runTestCase(entityType: string, unitTestGuid: string, caseName: string): Promise<InterpreterResult> {
        return this.api.post(`/unit-tests/${entityType}/suites/${unitTestGuid}/cases/${caseName}`, null, {
            outType: InterpreterResult,
        });
    }

    async generateDefaultMocks(entityType: string, unitTestGuid: string, caseName: string): Promise<string> {
        return this.api.get(`/unit-tests/${entityType}/suites/${unitTestGuid}/cases/${caseName}/assessments`);
    }

    async generateMocksTables(xmlContent: string): Promise<TestDataResultDto> {
        return this.api.post(`/unit-tests/testDataToTable`, {xmlContent}, { inType: ConvertMockRequest, outType: TestDataResultDto });
    }

    async generateMocksIntoXml(assessments: AssessmentDto[], mocks: MockDto[]): Promise<TestDataResultDto> {
        return this.api.post(`/unit-tests/testDataToXml`, {assessments, mocks}, { inType: TestDataResultRequest, outType: TestDataResultDto });
    }

    async updateTag(entityType: string, unitTestGuid: string, tag: any[] | null): Promise<void> {
        return this.api.put(`/unit-tests/${entityType}/suites/${unitTestGuid}/tag`, tag);
    }

    async deleteTestCase(entityType: string, unitTestGuid: string, caseName: string): Promise<void> {
        return this.api.delete(`/unit-tests/${entityType}/suites/${unitTestGuid}/cases/${caseName}`);
    }

    async duplicateTestCase(entityType: string, unitTestGuid: string, caseName: string, newCaseName: string): Promise<void> {
        return this.api.put(`/unit-tests/${entityType}/suites/${unitTestGuid}/cases/${caseName}/duplicate/${newCaseName}`);
    }

    async renameTestCase(entityType: EntityType, unitTestGuid: string, caseName: string, newCaseName: string): Promise<void> {
        return this.api.put(`/unit-tests/${entityType}/suites/${unitTestGuid}/cases/${caseName}/rename/${newCaseName}`);
    }

    async getAllTestReport(): Promise<TestReportResult[]>  {
        return this.api.getArray(`/unit-tests/suites/reports`, { outType: TestReportResult });
    }
}
