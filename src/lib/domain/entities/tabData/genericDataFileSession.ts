import { EntityLevel } from '../../enums/entityLevel';
import { EntityType } from '../../enums/entityType';
import { ITabData } from './iTabData';

export default class GenericDataFileSession extends ITabData {
    clazz: string = 'GenericDataFileSession';

    public fileGuid: string = '';
    public entityGuid: string = '';
    public entityLevel: EntityLevel = 'NONE';
    public name: string = '';
    public xmlData = '';


    public saved: boolean = false;
    public newFile: boolean = false;

    generateTabId(): string {
        return this.fileGuid;
    }

    getGuid(): string {
        return this.fileGuid;
    }

    getXmlData(): string {
        return this.xmlData;
    }

    getName(): string {
        return this.name;
    }

    getType(): EntityType {
        return '';
    }

    getExtra(): string {
        return `dataFile - ${this.fileGuid}`;
    }
}
