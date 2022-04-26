import { Expose } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';

export default class AssessmentDto {
    [immerable] = true;
    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public label: string = '';
    public observation: string = '';
    public expectedResult: string = '';
    
    constructor() {
        this.rowID = uuid();
    }
}