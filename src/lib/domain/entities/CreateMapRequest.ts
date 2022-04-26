import { immerable } from 'immer';
export default class CreateMapRequest {
    [immerable] = true;
    public name: string = '';
    public createCheckedOut: boolean = true;
    public criterionName: string = '';
    public criterionType: string = '01';
    public valueType: string = '01';
}