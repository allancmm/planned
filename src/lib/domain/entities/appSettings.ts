import { immerable } from 'immer';

export default class AppSettings {
    [immerable] = true;
    public isLockActivated: boolean = false;
    public structureType: 'TABLE' | 'BUSINESS' = 'BUSINESS';
    public isMetadataEnabled: boolean = false;
}
