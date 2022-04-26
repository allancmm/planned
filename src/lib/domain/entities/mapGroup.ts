import { Type } from 'class-transformer';
import { immerable } from 'immer';
import MapHeader from './mapHeader';
import MapRow from './mapRow';
import { RuleOverride } from './ruleOverride';

export const MG_META_VALUE_AS_ROW = '01';
export const MG_META_CRITERIA_AS_ROW = '02';
export default class MapGroup {
    [immerable] = true;

    @Type(() => MapHeader) public headers: MapHeader[] = [];
    @Type(() => MapRow) public rows: MapRow[] = [];

    public override?: RuleOverride;
    public displayOption: typeof MG_META_VALUE_AS_ROW | typeof MG_META_CRITERIA_AS_ROW = MG_META_VALUE_AS_ROW;
    public longDescription: string = '';
}
