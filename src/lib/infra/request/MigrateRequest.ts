import MigrationSet from '../../domain/entities/migrationSet';

export class MigrateRequest {
    public targetEnvironmentId: string = '';
    public migrationSets: MigrationSet[] = [];
}

export class MigrateReviewRequest {
    public targetEnvironmentId: string = '';
    public migrationSetsGuids: string[] = [];
}
