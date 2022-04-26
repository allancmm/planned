import { TabItem } from '../../components/editor/tabs/tabReducerTypes';
import EntityLockStatus from '../domain/entities/entityLockStatus';
import EntityStatus from '../domain/entities/entityStatus';
import { EntityType } from '../domain/enums/entityType';
import SourceControlRepository from '../domain/repositories/sourceControlRepository';
import * as SourceControlAssembler from '../infra/assembler/sourceControlAssembler';

export default class SourceControlService {
    constructor(private sourceControlRepository: SourceControlRepository) {}

    lock = async (entityType: EntityType, ruleGuid: string): Promise<EntityLockStatus> => {
        return this.sourceControlRepository.lock(entityType, ruleGuid);
    };

    unlock = async (entityType: EntityType, ruleGuid: string): Promise<EntityLockStatus> => {
        return this.sourceControlRepository.unlock(entityType, ruleGuid);
    };

    checkOut = async (entityType: EntityType, ruleGuid: string): Promise<EntityStatus> => {
        return this.sourceControlRepository.checkOut(entityType, ruleGuid);
    };

    undoCheckOut = async (entityType: EntityType, ruleGuid: string): Promise<EntityStatus> => {
        return this.sourceControlRepository.undoCheckOut(entityType, ruleGuid);
    };

    checkIn = async (
        entityType: EntityType,
        ruleGuid: string,
        tabs: TabItem[],
        force = false,
    ): Promise<EntityStatus> => {
        const checkInData = SourceControlAssembler.toCheckInRequest(tabs);
        return this.sourceControlRepository.checkIn(entityType, ruleGuid, checkInData, force);
    };
}
