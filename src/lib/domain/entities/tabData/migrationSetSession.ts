import { Type } from 'class-transformer';
import { EntityType } from '../../enums/entityType';
import ConfigPackage from '../configPackage';
import MigrationSet from '../migrationSet';
import Version from '../version';
import { ITabData } from './iTabData';

export default class MigrationSetSession extends ITabData {
    clazz: string = 'MigrationSetSession';

    @Type(() => MigrationSet) set: MigrationSet = new MigrationSet();
    @Type(() => ConfigPackage) pkgs: ConfigPackage[] = [];
    @Type(() => Version) versions: Version[] = [];

    openActionButton = false;

    @Type(() => MigrationSet)
    migrationSetEdit: MigrationSet = new MigrationSet();

    generateTabId(): string {
        return `MigrationSet - ${this.set.migrationSetGuid}`;
    }
    getGuid(): string {
        return this.set.migrationSetGuid;
    }
    getName(): string {
        return this.set.migrationSetName;
    }
    getType(): EntityType {
        return 'MIGRATION_SET';
    }
    getExtra(): string {
        return `Migration Set - ${this.set.migrationSetName}`;
    }
    getComments(): string {
        return this.set.comments;
    }
}
