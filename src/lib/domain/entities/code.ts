import { Expose } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';

export default class Code {
    [immerable] = true;

    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public codeValue: string = '';
    public value: string = '';
    public shortDescription: string = '';
    public longDescription: string = '';
    public systemIndicator: string = 'N';
    public changeToken: boolean = false;

    constructor() {
        this.rowID = uuid();
    }
}
