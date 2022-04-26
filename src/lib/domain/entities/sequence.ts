import { Exclude, Expose, Transform } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';
import { convertDate } from '../../util/transform';

export default class Sequence {
    @Exclude()
    public static guid = '45382CAE-9C61-4BB5-8040-1A4564131CD4';

    [immerable] = true;

    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public sequenceName: string = '';
    public sequenceInteger: number = 0;
    @Transform(convertDate)
    public sequenceDate?: Date;
    public sequenceDescription: string = '';
    public currentIndicator: string = '';
    public xmlData: string = '';
    public databaseSequenceName: string = '';

    constructor() {
        this.rowID = uuid();
    }
}
