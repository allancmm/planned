import { Transform } from 'class-transformer';
import { immerable } from 'immer';
import { convertDate } from '../../util/transform';

export default class CreateChartAccountEntryRequest {
    [immerable] = true;

    public chartOfAccountsEntityGuid: string = '';
    public debitCreditCode: string = '';
    public entryDescription: string = '';
    public accountingTypeCode: string = '';
    public accountingAmountField: string = '';
    public gainLossFlag: boolean = false;
    public flipOnNegativeFlag: boolean = false;
    @Transform(convertDate)
    public effectiveFromDate: Date = new Date();
    @Transform(convertDate)
    public effectiveToDate: Date = new Date();
    public doReversalAccountingFlag: boolean = false;
    public originalDisbursementStatusCode: string = '';
    public fundTypeCode: string = '';
    public accountNumberFormat: string = '';
    public linkSuspenseFlag: boolean = false;
    public createCheckedOut: boolean = true;
}