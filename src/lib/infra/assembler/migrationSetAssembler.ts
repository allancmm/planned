import Environment from '../../domain/entities/environment';
import MigrationSet from '../../domain/entities/migrationSet';
import { MigrateRequest } from '../request/MigrateRequest';
import { MigrationSetCreationRequest } from '../request/MigrationSetCreationRequest';

export const toMigrationSetCreationRequest = (
    name: string,
    packagesNames: string[],
): MigrationSetCreationRequest => {
    return {
        name,
        packagesNames,
    };
};

export const toMigrateRequest = (environment: Environment, migrationSets: MigrationSet[]): MigrateRequest => {
    return {
        targetEnvironmentId: environment.identifier,
        migrationSets: migrationSets,
    };
};

export const toMigrateSet = (name: string, comment: string, packagesNames: string[],) => {
    return {
        name,
        comment,
        packagesNames
    }
}
