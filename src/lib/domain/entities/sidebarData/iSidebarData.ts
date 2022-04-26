import { immerable } from 'immer';

export class ISidebarData {
    [immerable] = true;
    clazz: string = 'ISidebarData';
}
