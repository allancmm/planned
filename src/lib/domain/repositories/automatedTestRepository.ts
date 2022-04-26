import AutomatedTestSuite from '../entities/automatedTestItems/AutomatedTestSuite';

export default interface AutomatedTestRepository {
    getAutomatedTestSuites(): Promise<AutomatedTestSuite[]>;
    createTestCase(testCaseName: string, pathParent: string): Promise<void>;
}