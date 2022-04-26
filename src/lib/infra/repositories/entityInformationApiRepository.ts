import EntityStatus from '../../domain/entities/entityStatus';
import OipaRule from '../../domain/entities/oipaRule';
import EntityInformation from '../../domain/entities/tabData/entityInformation';
import ValidateVersionResponse from '../../domain/entities/validateVersionResponse';
import { EntityType } from '../../domain/enums/entityType';
import { FileType } from '../../domain/enums/fileType';
import EntityInformationRepository from '../../domain/repositories/entityInformationRepository';
import { ApiGateway } from '../config/apiGateway';

export default class EntityInformationApiRepository implements EntityInformationRepository {
    constructor(private api: ApiGateway) {}

    getEntityInformation = async (
        entityType: EntityType,
        guid: string,
        fileType: FileType,
        env?: string,
    ): Promise<EntityInformation> => {
        return this.api.get(
            `/editor/entity/${entityType}/${guid}?fileType=${fileType}${env ? `&oipaEnvironmentID=${env}` : ''}`,
            {
                outType: EntityInformation,
            },
        );
    };

    getResolvedEntityInformation = async (entityType: EntityType, guid: string, fileType: FileType): Promise<EntityInformation> => {
        return this.api.get(`/editor/entity/resolved/${entityType}/${guid}/${fileType}`, {
            outType: EntityInformation,
        });
    };

    getEntityStatusInformation = async (guid: string, logonEnvironmentId: string): Promise<EntityStatus> => {
        return this.api.get(`/editor/entity/ivs?guid=${guid}&logonEnvironmentId=${logonEnvironmentId}`, {
            outType: EntityStatus,
        });
    };

    getRelatedEntities = async (entityType: EntityType, guid: string, fileType: FileType): Promise<OipaRule[]> => {
        return this.api.getArray(`/editor/entity/relatedEntities/${entityType}/${guid}/${fileType}`, {
            outType: OipaRule,
        });
    };

    validateVersion = async (entityType: EntityType, guid: string, fileType: FileType, checksum: string | null): Promise<ValidateVersionResponse> => {
        return this.api.get(`/editor/entity/validateVersion/${entityType}/${guid}/${fileType}?checksum=${checksum}`, {outType: ValidateVersionResponse})
    }
}
