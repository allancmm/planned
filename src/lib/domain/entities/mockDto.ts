import { Expose } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';
import Currency from './currency';

export default class MockDto {
    [immerable] = true;
    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public variableName: string = '';
    public dataType: string = '';
    public value: string = '';
    public dateValue : Date = new Date();
    public currency?: Currency = new Currency();

    constructor() {
        this.rowID = uuid();
        this.dataType = 'TEXT';
    }
}