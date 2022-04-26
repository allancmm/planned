import { Expose, Exclude } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';

export default class Country {
    @Exclude()
    public static guid = '62401835-117D-41DE-8101-7492448B8D38';

    [immerable] = true;

    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public countryShortName: string = '';
    public countryCode: string = '';
    public countryLongName: string = '';
    public taxableCurrencyCode: string = '';
    public callingCode: string = '';

    constructor() {
        this.rowID = uuid();
    }
}
