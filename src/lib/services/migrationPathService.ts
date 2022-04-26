import MigrationPathRepository from "../domain/repositories/migrationPathRepository";
import { MigrationPath } from "../domain/entities/migrationPath";

export default class MigrationPathService implements MigrationPathRepository {

    constructor(private migrationPathRepository: MigrationPathRepository) {}

    getAllMigrationPath = async () : Promise<MigrationPath[]> => this.migrationPathRepository.getAllMigrationPath();

    updateMigrationPath = async (migrationPath: MigrationPath) : Promise<MigrationPath> =>
        this.migrationPathRepository.updateMigrationPath(migrationPath);

    deleteMigrationPath = async (idMigrationPath: string) : Promise<void> =>
        this.migrationPathRepository.deleteMigrationPath(idMigrationPath);

    createMigrationPath = async (migrationPath: MigrationPath) : Promise<MigrationPath> =>
        this.migrationPathRepository.createMigrationPath(migrationPath);
}