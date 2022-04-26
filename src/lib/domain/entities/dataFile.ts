import { EntityLevel } from '../enums/entityLevel';

export default class DataFile {
    public dataFileGuid: string = '';
    public dataFileName: string = '';
    public entityLevel: EntityLevel = 'NONE';
    public xmlData: string = '';
}
