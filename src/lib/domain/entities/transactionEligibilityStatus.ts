import { immerable } from 'immer';

export default class TransactionEligibilityStatus {
    [immerable] = true;

    public codeValue: string = '';
    public shortDescription: string = '';
}