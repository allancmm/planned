import { immerable } from 'immer';

export default class Translation {
    [immerable] = true;

    public translationGuid: string = '';
    public locale: string = '';
    public translationKey: string = '';
    public translationValue: string = '';
    public modified: boolean = false;
    public created: boolean = false;
}
