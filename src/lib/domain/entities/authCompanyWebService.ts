import { immerable } from 'immer';

export default class AuthCompanyWebService {
    [immerable] = true;

    public id: number;
    public webServiceName: string;
    public access: string;

    constructor(id: number, webServiceName: string, access: string){
        this.id = id;
        this.webServiceName = webServiceName;
        this.access = access;
    }
}