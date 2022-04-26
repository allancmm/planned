import {immerable} from 'immer';

export default class ChartOfAccountsMoneyType {
    [immerable] = true;

    moneyTypeCode: string;
    chartOfAccountsEntryGuid: string;

    constructor(moneyTypeCode: string, chartOfAccountsEntryGuid: string) {
        this.moneyTypeCode = moneyTypeCode;
        this.chartOfAccountsEntryGuid = chartOfAccountsEntryGuid;
    }
}