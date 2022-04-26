import {Expose} from 'class-transformer';
import {immerable} from 'immer';
import {v4 as uuid} from 'uuid';

export default class EntityField {
    [immerable] = true;

    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public entityGuid: string = '';
    public fieldName: string = '';
    public fieldDisplayName: string = '';
    public fieldTypeCode: string = '';
    public fieldValue?: string = '';
    public changeToken: boolean = false;

    constructor(entityGuid?: string) {
        this.rowID = uuid();
        if (entityGuid) {
            this.entityGuid = entityGuid;
        }
    }
}