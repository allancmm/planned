import ConfigPackageList from '../entities/configPackageList';
import Environment from '../entities/environment';
import MigrateReview from '../entities/migrateReview';
import MigrationHistoryList from '../entities/migrationHistoryList';
import MigrationSet from '../entities/migrationSet';
import MigrationSetList from '../entities/migrationSetList';
import MigrationSetsResponse from '../entities/migrationSetsResponse';
import Pageable from '../util/pageable';

export default interface MigrationSetRepository {
    getReadyToMigrateSets(): Promise<MigrationSetList>;

    getAllMigrationSets(searchQuery: string, page: Pageable): Promise<MigrationSetList>;

    getAllReadyMigrationSets(searchQuery: string, page: Pageable): Promise<MigrationSetList>;

    getAllSentMigrationSets(searchQuery: string, page: Pageable): Promise<MigrationSetList>;

    getAllReceivedMigrationSets(searchQuery: string, page: Pageable): Promise<MigrationSetList>;

    createMigrationSet(name: string, packagesNames: string[]): Promise<void>;

    addPackageToMigrationSet(migrationSet: MigrationSet, packagesNames: string[]): Promise<void>;

    migrateSets(migrationSets: MigrationSet[], environment: Environment): Promise<MigrationSetsResponse>;

    editMigrationSet(migrationSet: MigrationSet): Promise<void>;

    reopenMigrationSet(migrationSetGuid: string): Promise<string>;

    reviewMigrationSets(migrationSets: MigrationSet[], environment: Environment): Promise<MigrateReview[]>;

    getPackagesInMigrationSet(migrationSetGuid: string): Promise<ConfigPackageList>;

    getSetHistory(migrationSetGuid: string): Promise<MigrationHistoryList>;

    deleteMigrationSet(migrationSetGuid: string) : Promise<void>;
}
