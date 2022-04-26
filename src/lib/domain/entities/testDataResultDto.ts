import { Expose } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';
import AssessmentDto from './assessmentDto';
import MockDto from './mockDto';

export default class TestDataResultDto {
    [immerable] = true;
    @Expose({ groups: ['cache'] })
    public rowID: string = '';

    public mocks: MockDto[] = [];
    public xmlResult: string = '';
    public assessments: AssessmentDto[] = [];

    constructor() {
        this.rowID = uuid();
    }
}