import AutomatedTestSuite from '../domain/entities/automatedTestItems/AutomatedTestSuite';
import AutomatedTestRepository from '../domain/repositories/automatedTestRepository';

export default class AutomatedTestService {
    constructor(private automatedTestRepository: AutomatedTestRepository) {}

    getAutomatedTestSuites = async (): Promise<AutomatedTestSuite[]> => this.automatedTestRepository.getAutomatedTestSuites();


    createTestCase = async (testCaseName: string, pathParent: string): Promise<void> => this.automatedTestRepository.createTestCase(testCaseName, pathParent);

   }
