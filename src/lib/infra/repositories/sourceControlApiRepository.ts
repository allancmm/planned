import EntityLockStatus from '../../domain/entities/entityLockStatus';
import EntityStatus from '../../domain/entities/entityStatus';
import { EntityType } from '../../domain/enums/entityType';
import SourceControlRepository from '../../domain/repositories/sourceControlRepository';
import { ApiGateway } from '../config/apiGateway';
import CheckInRequest from '../request/checkInRequest';

export default class SourceControlApiRepository implements SourceControlRepository {
    constructor(private api: ApiGateway) {}

    lock = async (entityType: EntityType, ruleGuid: string): Promise<EntityLockStatus> => {
        return this.api.post(`/editor/lock/${entityType}/${ruleGuid}`, null, { outType: EntityLockStatus });
    };

    unlock = async (entityType: EntityType, ruleGuid: string): Promise<EntityLockStatus> => {
        return this.api.post(`/editor/unlock/${entityType}/${ruleGuid}`, null, { outType: EntityLockStatus });
    };

    checkOut = async (entityType: EntityType, ruleGuid: string): Promise<EntityStatus> => {
        return this.api.post(`/editor/checkOut/${entityType}/${ruleGuid}`, null, {
            outType: EntityStatus,
        });
    };

    undoCheckOut = async (entityType: EntityType, ruleGuid: string): Promise<EntityStatus> => {
        return this.api.post(`/editor/undoCheckOut/${entityType}/${ruleGuid}`, null, {
            outType: EntityStatus,
        });
    };

    checkIn = async (
        entityType: EntityType,
        ruleGuid: string,
        checkInRequest: CheckInRequest,
        force: boolean,
    ): Promise<EntityStatus> => {
        return this.api.post(`/editor/checkIn/${entityType}/${ruleGuid}?force=${force}`, checkInRequest, {
            inType: CheckInRequest,
            outType: EntityStatus,
        });
    };
}
