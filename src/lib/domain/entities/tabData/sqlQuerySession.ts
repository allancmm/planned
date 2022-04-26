import {EntityType} from '../../enums/entityType';
import {ITabData} from './iTabData';

export default class SqlQuerySession extends ITabData {
    clazz: string = "SqlQuerySession";

    public queryResult: Object[] = [];

    query = '';
    pageSize = 10;
    xmlDataDisplayModal = '';

    generateTabId(): string {
        return this.clazz;
    }

    getExtra(): string {
        return 'Sql Query';
    }

    getGuid(): string {
        return this.clazz;
    }

    getName(): string {
        return 'SQL Query';
    }

    getType(): EntityType {
        return '';
    }
}