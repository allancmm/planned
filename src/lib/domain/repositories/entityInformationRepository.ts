import EntityStatus from '../entities/entityStatus';
import OipaRule from '../entities/oipaRule';
import EntityInformation from '../entities/tabData/entityInformation';
import ValidateVersionResponse from '../entities/validateVersionResponse';
import { EntityType } from '../enums/entityType';
import { FileType } from '../enums/fileType';

export default interface EntityInformationRepository {
    getRelatedEntities(entityType: EntityType, guid: string, fileType: FileType): Promise<OipaRule[]>;

    getEntityInformation(
        entityType: EntityType,
        guid: string,
        fileType: FileType,
        env?: string,
    ): Promise<EntityInformation>;

    getResolvedEntityInformation(entityType: EntityType, guid: string, fileType: FileType): Promise<EntityInformation>;

    getEntityStatusInformation(guid: string, logonEnvironmentId: string): Promise<EntityStatus>;

    validateVersion(entityType: EntityType, guid: string, fileType: FileType, checksum: string | null): Promise<ValidateVersionResponse>
}
