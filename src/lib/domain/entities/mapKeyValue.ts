import { immerable } from 'immer';

export default class MapKeyValue {
    [immerable] = true;

    public codeValue: string = '';
    public shortDescription: string = '';
}