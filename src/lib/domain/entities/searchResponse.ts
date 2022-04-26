import { Type } from 'class-transformer';
import { immerable } from 'immer';
import { EntityType } from '../enums/entityType';
import { FileType } from '../enums/fileType';
import { RuleOverride } from './ruleOverride';

export class SearchResponse {
    [immerable] = true;

    public entityName: string = '';
    public entityType: EntityType = '';
    public entityGuid: string = '';
    public fileType: FileType = 'DEFAULT';
    @Type(() => RuleOverride) public ruleOverride: RuleOverride = new RuleOverride();
}
