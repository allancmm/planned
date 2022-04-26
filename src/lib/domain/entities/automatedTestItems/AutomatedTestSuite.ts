import {Type} from 'class-transformer';
import {immerable} from 'immer';
import AutomatedTestCase from './automatedTestCase';

export default class AutomatedTestSuite {
    [immerable] = true;

    level: number = 1;
    public htmlInput: JSX.Element | null = null;

    public uuid: string = '';
    public id: string = '';
    public path: string = '';

    @Type(() => AutomatedTestCase) public testCases: AutomatedTestCase[] = [];
}
