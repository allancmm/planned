import { EntityType } from '../enums/entityType';
import { EntityLevel } from '../enums/entityLevel';

export default class DebuggerParametersRequest {
    public type: EntityType = '';
    public level: EntityLevel = 'NONE';
    public entityGuid: string = '';
    public ruleGuid: string = '';
}
