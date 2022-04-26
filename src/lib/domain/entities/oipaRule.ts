import { Type } from 'class-transformer';
import { immerable } from 'immer';
import { EntityType } from '../enums/entityType';
import { FileType } from '../enums/fileType';
import { RuleTypeCodeEnum } from '../enums/ruleTypeCode';
import { RuleOverride } from './ruleOverride';

export default class OipaRule {
    [immerable] = true;

    public ruleGuid: string = '';
    public ruleType: string = '';
    public ruleName: string = '';
    public ruleFullName: string = '';
    public linkedFiles: FileType[] = [];
    public entityType: EntityType = '';

    @Type(() => RuleOverride) public override: RuleOverride = new RuleOverride();

    getRuleTypeName = (): string => {
        const ruleTypeName = RuleTypeCodeEnum.getEnumFromCode(this.ruleType);
        return ruleTypeName ? ruleTypeName.value : 'Undefined Rule Type';
    };
}
