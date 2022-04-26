import { Expose, Exclude } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';

export default class Currency {
    @Exclude()
    public static guid = '5FD2F395-6902-4605-E044-00144F1E56B3';

    [immerable] = true;

    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public currencyCode: string = '';
    public currencyName: string = '';
    public displayRoundPlaces: number = 0;
    public currencyRoundPlaces: number = 0;
    public currencyRoundMethod: string = '';

    constructor() {
        this.rowID = uuid();
    }
}
