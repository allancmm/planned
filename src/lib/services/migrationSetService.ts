import ConfigPackageList from '../domain/entities/configPackageList';
import Environment from '../domain/entities/environment';
import MigrateReview from '../domain/entities/migrateReview';
import MigrationHistoryList from '../domain/entities/migrationHistoryList';
import MigrationSet from '../domain/entities/migrationSet';
import MigrationSetList from '../domain/entities/migrationSetList';
import MigrationSetsResponse from '../domain/entities/migrationSetsResponse';
import MigrationSetRepository from '../domain/repositories/migrationSetRepository';
import Pageable from '../domain/util/pageable';

export default class MigrationSetService {
    constructor(private migrationSetRepository: MigrationSetRepository) {}

    // Getters
    getReadyToMigrateSets = async (): Promise<MigrationSetList> => {
        return this.migrationSetRepository.getReadyToMigrateSets();
    };

    getAllMigrationSets = async (searchQuery: string, page: Pageable): Promise<MigrationSetList> => {
        return this.migrationSetRepository.getAllMigrationSets(searchQuery, page);
    };

    getAllReadyMigrationSets = async (searchQuery: string, page: Pageable): Promise<MigrationSetList> => {
        return this.migrationSetRepository.getAllReadyMigrationSets(searchQuery, page);
    };

    getAllSentMigrationSets = async (searchQuery: string, page: Pageable): Promise<MigrationSetList> => {
        return this.migrationSetRepository.getAllSentMigrationSets(searchQuery, page);
    };

    getAllReceivedMigrationSets = async (searchQuery: string, page: Pageable): Promise<MigrationSetList> => {
        return this.migrationSetRepository.getAllReceivedMigrationSets(searchQuery, page);
    };

    getPackagesInMigrationSet = async (migrationSetGuid: string): Promise<ConfigPackageList> => {
        return this.migrationSetRepository.getPackagesInMigrationSet(migrationSetGuid);
    };

    getSetHistory = async (migrationSetGuid: string): Promise<MigrationHistoryList> => {
        return this.migrationSetRepository.getSetHistory(migrationSetGuid);
    };

    // Actions
    createMigrationSet = async (name: string, packagesNames: string[]): Promise<void> => {
        return this.migrationSetRepository.createMigrationSet(name, packagesNames);
    };

    addPackageToMigrationSet = async (migrationSet: MigrationSet, packagesNames: string[]): Promise<void> => {
        return this.migrationSetRepository.addPackageToMigrationSet(migrationSet, packagesNames);
    };

    migrateSets = async (migrationSets: MigrationSet[], environment: Environment): Promise<MigrationSetsResponse> => {
        return this.migrationSetRepository.migrateSets(migrationSets, environment);
    };

    renameMigrationSet = async (migrationSet: MigrationSet) : Promise<void> =>
        this.migrationSetRepository.editMigrationSet(migrationSet);

    reopenMigrationSet = async (migrationSetGuid: string): Promise<string> => {
        return this.migrationSetRepository.reopenMigrationSet(migrationSetGuid);
    };

    fetchMigrationReview = async (
        migrationSets: MigrationSet[],
        environment: Environment,
    ): Promise<MigrateReview[]> => {
        return this.migrationSetRepository.reviewMigrationSets(migrationSets, environment);
    };

    deleteMigrationSet = async (migrationSetGuid: string) : Promise<void> =>
        this.migrationSetRepository.deleteMigrationSet(migrationSetGuid);

    editMigrationSet =  async(migrationSet: MigrationSet) : Promise<void> => {
        return this.migrationSetRepository.editMigrationSet(migrationSet)
    }
}
