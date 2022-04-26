export default class Company {
    public companyGuid: string = '';
    public clientGuid: string = '';
    public companyName: string = '';
    public defaultCurrencyCode: string = '';

    constructor(companyGuid?: string, companyName?: string) {
        this.companyGuid = companyGuid || '';
        this.companyName = companyName || '';
    }
}
