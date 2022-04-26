import { Expose, Exclude } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';

export default class ErrorCatalog {
    @Exclude()
    public static guid = '61401835-117D-41DE-8101-9992448B8D38';

    [immerable] = true;

    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public errorNumber: string = '';
    public errorMessage: string = '';
    public errorFixTip: string = '';

    constructor() {
        this.rowID = uuid();
    }
}
