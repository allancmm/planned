import {EntityType} from '../../enums/entityType';
import SystemDate from '../systemDate';
import SystemDateFiltersContainer from '../systemDateFiltersContainer';
import {ITabData} from './iTabData';

export default class SystemDateSession extends ITabData {
    clazz: string = 'SystemDateSession';
    systemDateFiltersContainer: SystemDateFiltersContainer = new SystemDateFiltersContainer();
    systemDates: SystemDate[] = []

    generateTabId(): string {
        return this.clazz;
    }

    getExtra(): string {
        return 'System Date';
    }

    getGuid(): string {
        return '';
    }

    getName(): string {
        return 'System Dates';
    }

    getType(): EntityType {
        return 'SYSTEM_DATE'
    }
}