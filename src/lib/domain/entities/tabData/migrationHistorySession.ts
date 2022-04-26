import { EntityType } from '../../enums/entityType';
import { ITabData } from './iTabData';

export default class MigrationHistorySession extends ITabData {
    clazz: string = 'MigrationHistorySession';

    generateTabId(): string {
        return `MigrationHistory`;
    }
    getGuid(): string {
        return this.generateTabId();
    }
    getName(): string {
        return 'Migration Set Extended View';
    }
    getType(): EntityType {
        return '';
    }
    getExtra(): string {
        return 'History';
    }
}
