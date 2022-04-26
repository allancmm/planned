import { EntityType } from '../../enums/entityType';
import { ITabData } from './iTabData';

export default class CategorySession extends ITabData {
    clazz: string = 'CategorySession';

    public categoryGuid: string = '';
    public categoryPath: string = '';

    public saved: boolean = true;

    generateTabId(): string {
        return this.categoryGuid;
    }

    getGuid(): string {
        return this.categoryGuid;
    }

    getName(): string {
        return this.categoryGuid;
    }

    getType(): EntityType {
        return '';
    }
    getExtra(): string {
        return `Category - ${this.categoryGuid}`;
    }
}
