import {immerable} from 'immer';
import {EntityLevel} from '../enums/entityLevel';
import {EntityType} from '../enums/entityType';

export default class EntityAttachedRulesRequest {
    [immerable] = true;

    public guid: string = '';
    public level: EntityLevel = 'NONE';
    public type: EntityType = '';
    public attachedRules: string[] = [];
    public createCheckedOut: boolean = true;
}