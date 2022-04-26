import { immerable } from "immer";

export default class CreateAsFileRequest{
    [immerable] = true;

    public fileID: string = '';
    public companyGuid: string = '';
    public name: string = '';  
    public createCheckedOut: boolean = true;
    public templateName?: string;
}