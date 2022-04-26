import CoverageResult from './coverageResult';
import {Expose, Type} from 'class-transformer';
import { v4 as uuid } from "uuid";
import { AssertionStatus } from "./testCase";

export default class TestResult {
    @Expose({ groups: ['cache'] })
    public id: string;

    public asserts: number = 0;
    public failures: number = 0;
    public skipped: number = 0;
    public noTestCase = 0;

    public name: string = '';
    public packageName: string = '';

    public type: TestResultType = 'TEST_SUITES';
    @Type(() => AssessmentResult) public result: AssessmentResult = new AssessmentResult();
    @Type(() => TestResult) public subTests: TestResult[] = [];

    public executionTime: number = 0;

    @Type(() => CoverageResult) public coverageResult: CoverageResult = new CoverageResult();

    constructor() {
        this.id = uuid();
    }
}

export type TestResultType = 'ASSESSMENT' | 'TEST_CASE' | 'TEST_SUITE' | 'TEST_SUITES';

export class AssessmentResult {
    public status: AssertionStatus = 'NOT_EXECUTED';
    public expected: any;
    public actual: any;
    public details: string = '';
}
