import { immerable } from 'immer';

export default class SecurityGroupDataDetail {
    [immerable] = true;

    public id: number;
    public buttonName: string = '';
    public access: string = '';
    public pageName?: string = '';
    
    constructor(id: number, buttonName: string, access: string, pageName?: string) {
        this.id = id;
        this.buttonName = buttonName;
        this.access = access;
        this.pageName = pageName || '';
    }
}

