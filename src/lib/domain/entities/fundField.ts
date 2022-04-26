import {Expose} from 'class-transformer';
import {immerable} from 'immer';
import {v4 as uuid} from 'uuid';

export default class FundField {
    [immerable] = true;

    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public fundGuid: string = '';
    public fieldName: string = '';
    public fieldTypeCode: string = '';
    public textValue?: string;
    public intValue?: number;
    public floatValue?: number;
    public dateValue?: Date;
    public currencyCode?: string;
    public bigTextValue?: string;
    public optionText?: string;
    public optionTextFlag?: number;
    public changeToken: boolean = false;

    constructor(fundGuid?: string) {
        this.rowID = uuid();
        if (fundGuid) {
            this.fundGuid = fundGuid;
        }
    }
}