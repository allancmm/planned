import CreateTestCase from '../domain/entities/createTestCase';
import {RunTestSuiteRequest} from '../domain/entities/runTestSuiteRequest';
import TestCase from '../domain/entities/testCase';
import TestSuite from '../domain/entities/testSuite';
import TestTypes from '../domain/entities/testTypes';
import {EntityType} from '../domain/enums/entityType';
import UnitTestRepository from '../domain/repositories/unitTestRepository';
import {TestReportResult} from "../domain/entities/testReportResult";
import AssessmentDto from '../domain/entities/assessmentDto';
import MockDto from '../domain/entities/mockDto';

export default class UnitTestService {
    constructor(private unitTestRepository: UnitTestRepository) {}

    getTestTypesWithCoverage = async (): Promise<TestTypes[]> => {
        return this.unitTestRepository.getTestTypesWithCoverage();
    };

    getTestTypes = async (): Promise<EntityType[]> => {
        return this.unitTestRepository.getTestTypes();
    };

    supportsTesting = async (entityType: EntityType): Promise<boolean> => {
        return this.unitTestRepository.supportsTesting(entityType);
    };

    getTestSuites = async (entityType: EntityType): Promise<TestSuite[]> => {
        return this.unitTestRepository.getTestSuites(entityType);
    };

    getAllTestSuitesTags = async (): Promise<string[]> => {
        return this.unitTestRepository.getAllTestSuitesTags();
    };

    getTestCases = async (entityType: string, unitTestGuid: string): Promise<TestCase[]> => {
        return this.unitTestRepository.getTestCases(entityType, unitTestGuid);
    };

    loadTestSuite = async (entityType: EntityType, unitTestGuid: string): Promise<TestSuite> => {
        return this.unitTestRepository.loadTestSuite(entityType, unitTestGuid);
    };

    loadTestCase = async (entityType: string, unitTestGuid: string, caseName: string): Promise<TestCase> => {
        return this.unitTestRepository.loadTestCase(entityType, unitTestGuid, caseName);
    };

    createTestSuite = async (entityType: string, guid: string, name: string): Promise<string> => {
        return this.unitTestRepository.createTestSuite(entityType, guid, name);
    };

    createTestCase = async (name: string, entityType: string, unitTestGuid: string): Promise<void> => {
        return this.unitTestRepository.createTestCase(name, entityType, unitTestGuid);
    };

    saveTestCase = async (
        name: string,
        entityType: string,
        unitTestGuid: string,
        testCaseData: CreateTestCase,
    ): Promise<void> => {
        return this.unitTestRepository.saveTestCase(name, entityType, unitTestGuid, testCaseData);
    };

    runAllTests = async () => {
        return this.unitTestRepository.runAllTests();
    };

    runAllTestsWithTags = async (runTestSuiteRequest: RunTestSuiteRequest) => {
        return this.unitTestRepository.runAllTestsWithTags(runTestSuiteRequest);
    };

    runTestSuite = async (entityType: string, unitTestGuid: string) => {
        return this.unitTestRepository.runTestSuite(entityType, unitTestGuid);
    };

    runTestCase = async (entityType: string, unitTestGuid: string, caseName: string) => {
        return this.unitTestRepository.runTestCase(entityType, unitTestGuid, caseName);
    };

    generateDefaultMocks = async (entityType: string, unitTestGuid: string, caseName: string) => {
        return this.unitTestRepository.generateDefaultMocks(entityType, unitTestGuid, caseName);
    };

    generateMocksTables= async(xmlContent: string) => {
        return this.unitTestRepository.generateMocksTables(xmlContent);
    };

    generateMocksIntoXml= async(assessments: AssessmentDto[], mocks: MockDto[]) => {
        return this.unitTestRepository.generateMocksIntoXml(assessments, mocks);
    };

    updateTag = async (entityType: string, unitTestGuid: string, tag: any[] | null) => {
        return this.unitTestRepository.updateTag(entityType, unitTestGuid, tag);
    }

    deleteTestCase = async (entityType: EntityType, unitTestGuid: string, caseName: string) => {
        return this.unitTestRepository.deleteTestCase(entityType, unitTestGuid, caseName);
    }

    duplicateTestCase = async (entityType: EntityType, unitTestGuid: string, caseName: string, newCaseName: string) => {
        return this.unitTestRepository.duplicateTestCase(entityType, unitTestGuid, caseName, newCaseName);
    }

    renameTestCase = async (entityType: EntityType, unitTestGuid: string, caseName: string, newCaseName: string) => {
        return this.unitTestRepository.renameTestCase(entityType, unitTestGuid, caseName, newCaseName);
    }

    getAllTestReport = async () : Promise<TestReportResult[]> => this.unitTestRepository.getAllTestReport();
}
