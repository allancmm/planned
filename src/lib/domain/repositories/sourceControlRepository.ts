import CheckInRequest from '../../infra/request/checkInRequest';
import EntityLockStatus from '../entities/entityLockStatus';
import EntityStatus from '../entities/entityStatus';
import { EntityType } from '../enums/entityType';

export default interface SourceControlRepository {
    lock(entityType: EntityType, ruleGuid: string): Promise<EntityLockStatus>;

    unlock(entityType: EntityType, ruleGuid: string): Promise<EntityLockStatus>;

    checkOut(entityType: EntityType, ruleGuid: string): Promise<EntityStatus>;

    undoCheckOut(entityType: EntityType, ruleGuid: string): Promise<EntityStatus>;

    checkIn(
        entityType: EntityType,
        ruleGuid: string,
        checkInRequest: CheckInRequest,
        force: boolean,
    ): Promise<EntityStatus>;
}
