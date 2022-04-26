import { immerable } from "immer";

export default class CreateCompanyRequest {
    [immerable] = true;

    public companyName: string = '';
    public defaultCurrencyCode?: string;
    public marketMakerGUID?: string;
    public calendarCode: string = '';
    public effectiveDate?: Date;
    public primaryCompanyGUID?: string;
    public createCheckedOut: boolean = true;
}