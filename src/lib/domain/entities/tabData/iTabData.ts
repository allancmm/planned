import EntityStatus from '../entityStatus';
import { EntityType } from '../../enums/entityType';
import { immerable } from 'immer';
import EntityLockStatus from '../entityLockStatus';
import { Type } from 'class-transformer';

export abstract class  ITabData {
    abstract clazz: string;

    /** Since we use Immer to produce immutable object,
     * whenever you implement this interface, you should add this symbol to most classes objects used by the implementations.
     * Otherwise you might have rerendering issues*/
    [immerable] = true;

    @Type(() => EntityStatus) public status: EntityStatus = new EntityStatus();
    @Type(() => EntityLockStatus) public lockStatus: EntityLockStatus = new EntityLockStatus();

    abstract generateTabId(): string;
    abstract getGuid(): string;
    abstract getName(): string;
    abstract getType(): EntityType;
    abstract getExtra(): string;
}
