import TestResult from './testResult';
import { Type } from 'class-transformer';
import { immerable } from 'immer';

export default class InterpreterResult {
    [immerable] = true;
    public xmlResult: string = '';
    public errorDocument: string = '';
    public combinedDocument: string = '';
    @Type(() => TestResult) public testResult: TestResult = new TestResult();
}
