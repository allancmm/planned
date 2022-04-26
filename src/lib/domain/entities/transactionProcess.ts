import { immerable } from 'immer';

export default class TransactionProcess {
    [immerable] = true;

    public transactionGuid: string = '';
    public transactionName: string = '';
    public override: string = '';
    public processOrder: number = 0;
}