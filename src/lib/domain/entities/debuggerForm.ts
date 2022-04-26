import { Type } from 'class-transformer';
import { immerable } from 'immer';
import { EntityLevel } from '../enums/entityLevel';
import { EntityType } from '../enums/entityType';
import DebuggerEntity from './debuggerEntity';
import DebuggerParameters from './debuggerParameters';
import BasicEntity from './basicEntity';

export default class DebuggerForm {
    [immerable] = true;

    public entityType: EntityType = '';
    public entityLevel: EntityLevel = '';
    public ruleGuid: string = '';

    public effectiveDate: Date = new Date();

    @Type(() => DebuggerEntity) public entity: DebuggerEntity | null = null;

    @Type(() => BasicEntity) public rules: BasicEntity[] = [];

    @Type(() => DebuggerParameters) public params: DebuggerParameters = new DebuggerParameters();
}
