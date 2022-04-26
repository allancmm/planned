import EntityStatus from '../entities/entityStatus';
import Version from '../entities/version';
import { EntityType } from '../enums/entityType';
import { FileType } from '../enums/fileType';

export default interface HistoryRepository {
    hasHistory(ruleGuid: string, envId: string): Promise<boolean>;
    getVersionListInEnv(ruleGuid: string, envId: string): Promise<Version[]>;
    getVersionAsXML(ruleGuid: string, versionNumber: number, fileType: FileType): Promise<string>;
    revertToVersion(
        version: Version,
        ruleGuid: string,
        fileType: FileType,
        entityType: EntityType,
    ): Promise<EntityStatus>;
    getLatestVersion(ruleGuid: string): Promise<Version>;
}
