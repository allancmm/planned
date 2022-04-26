import CoverageResult from './coverageResult';
import { Type } from 'class-transformer';
import { immerable } from 'immer';

export default class TestSuite {
    [immerable] = true;
    public ruleGuid: string = '';
    public ruleName: string = '';
    public unitTestGuid: string = '';
    public override: string = '';

    public tag = [];

    public cases: string[] = [];

    @Type(() => CoverageResult) public coverage?: CoverageResult = new CoverageResult();
}
