import { Expose } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';
import Currency from './currency';

export default class ParameterItem {
    [immerable] = true;
    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public activityField: string = '';
    public dataType: string = '';
    public value: string = '';
    public editable: boolean=true;
    public dateValue : Date = new Date();
    public index: number = 1;
    public fieldType:string = '';
    public currency: Currency = new Currency();

    
    constructor() {
        this.rowID = uuid();
    }
}