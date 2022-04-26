import MigrationPathRepository from "../../domain/repositories/migrationPathRepository";
import { ApiGateway } from "../config/apiGateway";
import {MigrationPath} from "../../domain/entities/migrationPath";

export default class MigrationPathApiRepository implements MigrationPathRepository {
    constructor(private api: ApiGateway) {}

    getAllMigrationPath = async () => this.api.getArray('/migrationPath', { outType: MigrationPath });

    updateMigrationPath = async (migrationPath: MigrationPath) : Promise<MigrationPath> =>
        this.api.put('/migrationPath', migrationPath, { inType: MigrationPath, outType: MigrationPath });

    deleteMigrationPath = async (idMigrationPath: string) : Promise<void> =>
        this.api.delete(`/migrationPath?id=${idMigrationPath}`);

    createMigrationPath = async (migrationPath: MigrationPath) : Promise<MigrationPath> => {
        return this.api.post('/migrationPath', migrationPath, {inType: MigrationPath, outType: MigrationPath})
    };
}