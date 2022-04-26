import { immerable } from 'immer';

export class RuleOverride {
    [immerable] = true;

    public overrideGuid: string = '';
    public overrideName: string = '';
    public overrideTypeCode: string = '';
    public name: string = '';
}
