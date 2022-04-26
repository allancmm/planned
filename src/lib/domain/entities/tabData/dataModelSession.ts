import { EntityType } from '../../enums/entityType';
import { ITabData } from './iTabData';

export default class DataModelSession extends ITabData {
    clazz: string = 'DataModelSession';

    public dataModelGuid: string = '';
    public dataModelPath: string = '';

    public saved: boolean = true;

    generateTabId(): string {
        return this.dataModelGuid;
    }

    getGuid(): string {
        return this.dataModelGuid;
    }

    getName(): string {
        return this.dataModelGuid;
    }

    getType(): EntityType {
        return '';
    }
    getExtra(): string {
        return `DataModel - ${this.dataModelGuid}`;
    }
}
