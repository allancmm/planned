import { EntityType } from '../../enums/entityType';
import Environment from '../environment';
import MigrateReview from '../migrateReview';
import MigrationSet from '../migrationSet';
import MigrationSetsResponse from '../migrationSetsResponse';
import { ITabData } from './iTabData';

export default class MigrateReviewSession extends ITabData {
    clazz: string = 'MigrateReviewSession';

    public reviews: MigrateReview[] = [];
    public environment: Environment = new Environment();
    public migrationResponse: MigrationSetsResponse = new MigrationSetsResponse();

    environments: Environment[] = [];
    target = '';

    constructor(public migrationSets: MigrationSet[]) {
        super();
    }

    generateTabId(): string {
        return `MigrateReview - ${this.migrationSets.map((m) => m.migrationSetGuid).join(', ')}`;
    }
    getGuid(): string {
        return this.generateTabId();
    }
    getName(): string {
        return 'Migration Review';
    }
    getType(): EntityType {
        return '';
    }
    getExtra(): string {
        return this.migrationSets.map((m) => m.migrationSetName).join(', ');
    }
}
