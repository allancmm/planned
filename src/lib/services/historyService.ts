import EntityStatus from '../domain/entities/entityStatus';
import Version from '../domain/entities/version';
import { EntityType } from '../domain/enums/entityType';
import { FileType } from '../domain/enums/fileType';
import HistoryRepository from '../domain/repositories/historyRepository';

export default class HistoryService {
    constructor(private historyRepository: HistoryRepository) {}

    hasHistory = async (ruleGuid: string, envId: string): Promise<boolean> => {
        return this.historyRepository.hasHistory(ruleGuid, envId);
    };

    getVersionListInEnv = async (ruleGuid: string, envId: string): Promise<Version[]> => {
        return this.historyRepository.getVersionListInEnv(ruleGuid, envId);
    };

    getVersionAsXML = async (ruleGuid: string, versionNumber: number, fileType: FileType): Promise<string> => {
        return this.historyRepository.getVersionAsXML(ruleGuid, versionNumber, fileType);
    };

    revertToVersion = async (
        version: Version,
        ruleGuid: string,
        fileType: FileType,
        entityType: EntityType,
    ): Promise<EntityStatus> => {
        return this.historyRepository.revertToVersion(version, ruleGuid, fileType, entityType);
    };

    getLatestVersion = async (ruleGuid: string): Promise<Version> => {
        return this.historyRepository.getLatestVersion(ruleGuid);
    };
}
