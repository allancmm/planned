import {immerable} from 'immer';
import {EntityLevel} from '../enums/entityLevel';
import {EntityType} from '../enums/entityType';
import DebuggerEntity from './debuggerEntity';
import MultifieldItem from './multifieldItem';
import ParameterItem from './parameterItem';
import TestDataResultDto from './testDataResultDto';

export default class TestCase {
    [immerable] = true;
    public ruleGuid: string = '';
    public entityType: EntityType = '';

    public level: EntityLevel = 'NONE';
    public context: DebuggerEntity = new DebuggerEntity();

    public name: string = '';

    public section: string = '';
    public parameters: string = '';
    public lastResult: AssertionStatus = 'NOT_EXECUTED';
    public testData: string = '';

    public htmlInput: JSX.Element | null = null;

    public parametersTable: ParameterItem[] = [];

    // to manage the many sections of multifields that can have many parameters item by index
    public multifieldsIndex: MultifieldItem[] = [];

    public testDataTable: TestDataResultDto= new TestDataResultDto();
}
export const AssertionsStatusList = ['SUCCESS', 'NOT_EXECUTED', 'NO_TEST_CASE', 'FAILURE', 'COMPILATION_FAILURE'] as const;
export type AssertionStatus = typeof AssertionsStatusList[number];
