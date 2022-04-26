import { EntityType } from '../../domain/enums/entityType';
import { EntityLevel } from '../../domain/enums/entityLevel';
import DebuggerParametersRequest from '../../domain/entities/debuggerParametersRequest';

export const toDebuggerRequest = (
    type: EntityType,
    level: EntityLevel,
    entityGuid: string,
    ruleGuid: string,
): DebuggerParametersRequest => ({ type, level, entityGuid, ruleGuid });
