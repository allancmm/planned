import { immerable } from 'immer';

export default class UserSettings {
    [immerable] = true;
    public theme: string = '';
}
