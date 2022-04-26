import { immerable } from 'immer';

export default class OverrideSelector {
    [immerable] = true;

    public overrideLevel?: string;
    public overrideGuid?: string;
}
