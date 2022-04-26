import { MigrationPath } from "../entities/migrationPath";

export default interface MigrationPathRepository {

    getAllMigrationPath(): Promise<MigrationPath[]>;
    updateMigrationPath(migrationPath: MigrationPath): Promise<MigrationPath>;
    deleteMigrationPath(idMigrationPath: string): Promise<void>;
    createMigrationPath(migrationPath: MigrationPath): Promise<MigrationPath>;
}