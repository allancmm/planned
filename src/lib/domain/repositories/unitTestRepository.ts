import CreateTestCase from '../entities/createTestCase';
import InterpreterResult from '../entities/interpreterResult';
import {RunTestSuiteRequest} from '../entities/runTestSuiteRequest';
import TestCase from '../entities/testCase';
import TestResult from '../entities/testResult';
import TestSuite from '../entities/testSuite';
import TestTypes from '../entities/testTypes';
import {EntityType} from '../enums/entityType';
import {TestReportResult} from "../entities/testReportResult";
import TestDataResultDto from '../entities/testDataResultDto';
import AssessmentDto from '../entities/assessmentDto';
import MockDto from '../entities/mockDto';

export default interface UnitTestRepository {
    getTestTypes(): Promise<EntityType[]>;
    getTestTypesWithCoverage(): Promise<TestTypes[]>;
    supportsTesting(entityType: string): Promise<boolean>;
    getTestSuites(entityType: string): Promise<TestSuite[]>;
    getAllTestSuitesTags(): Promise<string[]>;
    getTestCases(entityType: string, unitTestGuid: string): Promise<TestCase[]>;
    loadTestCase(entityType: string, unitTestGuid: string, caseName: string): Promise<TestCase>;
    loadTestSuite(entityType: string, unitTestGuid: string): Promise<TestSuite>;

    createTestSuite(entityType: string, guid: string, name: string): Promise<string>;
    createTestCase(name: string, entityType: string, unitTestGuid: string): Promise<void>;
    saveTestCase(name: string, entityType: string, unitTestGuid: string, testCaseData: CreateTestCase): Promise<void>;

    runAllTests(): Promise<TestResult>;
    runAllTestsWithTags(runTestSuiteRequest: RunTestSuiteRequest): Promise<TestResult>;
    runTestSuite(entityType: string, unitTestGuid: string): Promise<TestResult>;
    runTestCase(entityType: string, unitTestGuid: string, caseName: string): Promise<InterpreterResult>;

    generateDefaultMocks(entityType: string, unitTestGuid: string, caseName: string): Promise<string>;

    generateMocksTables(xmlContent: string): Promise<TestDataResultDto>;

    generateMocksIntoXml(assessments: AssessmentDto[], mocks: MockDto[]): Promise<TestDataResultDto>;

    updateTag(entityType: string, unitTestGuid: string, tag: any[] | null): Promise<void>;

    deleteTestCase(entityType: EntityType, unitTestGuid: string, caseName: string): Promise<void>;
    duplicateTestCase(entityType: EntityType, unitTestGuid: string, caseName: string, newCaseName: string): Promise<void>;
    renameTestCase(entityType: EntityType, unitTestGuid: string, caseName: string, newCaseName: string): Promise<void>;

    getAllTestReport(): Promise<TestReportResult[]>;
}
