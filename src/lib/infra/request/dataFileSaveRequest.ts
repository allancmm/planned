import { EntityLevel } from '../../domain/enums/entityLevel';

export class DataFileSaveRequest {
    public dataFileGuid: string = '';
    public dataFileName: string = '';
    public entityLevel: EntityLevel = 'NONE';
    public xml: string = '';
    public create: boolean = true;
}

