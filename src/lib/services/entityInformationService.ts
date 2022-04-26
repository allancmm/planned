import EntityStatus from '../domain/entities/entityStatus';
import OipaRule from '../domain/entities/oipaRule';
import EntityInformation from '../domain/entities/tabData/entityInformation';
import ValidateVersionResponse from '../domain/entities/validateVersionResponse';
import { EntityType, toEntityType } from '../domain/enums/entityType';
import { FileType } from '../domain/enums/fileType';
import EntityInformationRepository from '../domain/repositories/entityInformationRepository';

export default class EntityInformationService {
    constructor(private entityInformationRepository: EntityInformationRepository) {}

    // Getters
    getEntityInformation = async (
        entityType: EntityType,
        guid: string,
        fileType: FileType,
        env?: string,
    ): Promise<EntityInformation> => {
        return this.entityInformationRepository.getEntityInformation(
            toEntityType(entityType, true),
            guid,
            fileType,
            env,
        );
    };

    getResolvedEntityInformation = async (entityType: EntityType, guid: string,fileType: FileType): Promise<EntityInformation> => {
        return this.entityInformationRepository.getResolvedEntityInformation(toEntityType(entityType, true), guid, fileType);
    };

    getEntityStatusInformation = async (guid: string, logonEnvironmentId: string): Promise<EntityStatus> => {
        return this.entityInformationRepository.getEntityStatusInformation(guid, logonEnvironmentId);
    };

    getRelatedEntities = async (entityType: EntityType, guid: string, fileType: FileType): Promise<OipaRule[]> => {
        return this.entityInformationRepository.getRelatedEntities(toEntityType(entityType, true), guid, fileType);
    };

    validateVersion = async (entityType: EntityType, guid: string, fileType: FileType, checksum: string | null): Promise<ValidateVersionResponse> => {
        return this.entityInformationRepository.validateVersion(entityType, guid, fileType, checksum)
    }
}
