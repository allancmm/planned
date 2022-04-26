import AutomatedTestSuite from '../../domain/entities/automatedTestItems/AutomatedTestSuite';
import AutomatedTestRepository from '../../domain/repositories/automatedTestRepository';
import { toAutomatedTestCaseCreationRequest } from '../assembler/functionalTestAssembler';
import { ApiGateway } from "../config/apiGateway";
import { AutomatedTestCaseCreationRequest } from '../request/automatedTestCaseRequest';

export default class AutomatedTestApiRepository implements AutomatedTestRepository {
    constructor(private api: ApiGateway) {}

    /* GETTERS */

    getAutomatedTestSuites = (): Promise<AutomatedTestSuite[]> => this.api.getArray(`/functional-tests/testSuites`);

    /* OPERATIONS */

    createTestCase = (testCaseName: string, pathParent: string): Promise<void> =>
        this.api.post(`/functional-tests/testcase`, toAutomatedTestCaseCreationRequest(testCaseName, pathParent),{
            inType: AutomatedTestCaseCreationRequest,
        });

}