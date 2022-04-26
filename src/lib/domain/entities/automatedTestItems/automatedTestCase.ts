import { Type } from 'class-transformer';
import { immerable } from 'immer';
import AutomatedTestStep from './automatedTestStep';
import AutomatedTestVariable from './automatedTestVariable';

export default class AutomatedTestCase {
    [immerable] = true;

    level: number = 1;

    public uuid = '';
    public id = '';
    public description = '';
    public name = '';
    public keyword = '';
    public tags: string[] = [];

    @Type(() => AutomatedTestVariable) public variables: AutomatedTestVariable[] = [];
    @Type(() => AutomatedTestStep) public steps: AutomatedTestStep[] = [];
}
