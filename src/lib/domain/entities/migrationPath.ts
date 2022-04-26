import { immerable } from "immer";
import { MigrationType } from "../enums/migrationType";

export class MigrationPath {
    [immerable] = true;

    public identifier: string = '';
    public displayName: string = '';
    public sourceEnvironmentIdentifier: string = '';
    public targetEnvironmentIdentifiers: string[] = [];
    public migrationTypes: MigrationType[] = [];
}