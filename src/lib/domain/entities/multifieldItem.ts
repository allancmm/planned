import { Expose } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';
import ParameterItem from './parameterItem';

export default class MultifieldItem {
    [immerable] = true;
    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public sourceName: string = '';
    public indexes: number[] = [];
    public parameterItemList: ParameterItem[] = [];
    
    constructor() {
        this.rowID = uuid();
    }
}