import {immerable} from 'immer';

export default class AutomatedTestVariable {
    [immerable] = true;

    level: number = 2;

    public name: string = '';
    public type: string = '';
    public dataType: string = '';
    public value: string = '';

    public edit: boolean = false;
    public add: boolean = false;
}