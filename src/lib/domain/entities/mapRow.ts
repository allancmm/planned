import { Type } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';
import MapCriteria from './mapCriteria';

export default class MapRow {
    [immerable] = true;

    public valueGuid: string = '';
    public valueText: string = '';
    @Type(() => MapCriteria) public criteria: MapCriteria[] = [];
    public valueTypeCode: string = '';

    public displayValue?: string;

    constructor() {
        this.valueGuid = uuid().toUpperCase();
    }
}
