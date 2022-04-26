import { immerable } from 'immer';

export const MAP_VALUE_COL = 'Value';
export const SHORT_DESC_CODE = '01';
export const LONG_DESC_CODE = '02';
export default class MapHeader {
    [immerable] = true;

    public displayName?: string;
    public codeList?: any[];

    constructor(public criteriaName: string) {}
}
