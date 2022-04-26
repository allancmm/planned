import EntityStatus from '../../domain/entities/entityStatus';
import Version from '../../domain/entities/version';
import { EntityType } from '../../domain/enums/entityType';
import { FileType } from '../../domain/enums/fileType';
import HistoryRepository from '../../domain/repositories/historyRepository';
import { ApiGateway } from '../config/apiGateway';

export default class HistoryApiRepository implements HistoryRepository {
    constructor(private api: ApiGateway) {}

    hasHistory = async (ruleGuid: string, envId: string): Promise<boolean> => {
        try {
            await this.api.head(`/history/${ruleGuid}/${envId}`);
            return Promise.resolve(true);
        } catch (e) {
            return Promise.resolve(false);
        }
    };

    getVersionListInEnv = async (ruleGuid: string, envId: string): Promise<Version[]> => {
        return this.api.getArray(`/history/${ruleGuid}/${envId}`, { outType: Version });
    };

    getVersionAsXML = async (ruleGuid: string, versionNumber: number, fileType: FileType): Promise<string> => {
        return this.api.get(`/history/${ruleGuid}/xml/${versionNumber}?fileType=${fileType}`);
    };

    revertToVersion = async (
        version: Version,
        ruleGuid: string,
        fileType: FileType,
        entityType: EntityType,
    ): Promise<EntityStatus> => {
        return this.api.put(
            '/history/revertToVersion',
            { version, ruleGuid, fileType, entityType },
            { inType: Object },
        );
    };

    getLatestVersion = async (ruleGuid: string): Promise<Version> => {
        return this.api.get(`/history/${ruleGuid}`, { outType: Version });
    };
}
