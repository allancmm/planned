import {Expose} from 'class-transformer';
import {immerable} from 'immer';
import {v4 as uuid} from 'uuid';

export default class RequirementCriterion {
    [immerable] = true;

    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public criteriaName: string = '';
    public typeCode: string = '';
    public dateValue?: Date;
    public textValue?: string;
    public intValue?: number;
    public floatValue?: number;
    public currencyCode?: string;
    public changeToken: boolean = false;

    constructor() {
        this.rowID = uuid();
    }
}