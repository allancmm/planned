import { immerable } from 'immer';

export default class TransactionType {
    [immerable] = true;

    public codeValue: string = '';
    public shortDescription: string = '';
}