import { Transform } from 'class-transformer';
import { SelectedField } from 'equisoft-design-ui-elements';
import { immerable } from 'immer';
import { convertDate } from '../../util/transform';

export default class StatsHeaderData {
    [immerable] = true;    
    public selectedUsernames: SelectedField[] = [];
    @Transform(convertDate)
    public start: Date = new Date();
    @Transform(convertDate)
    public end: Date = new Date();
}
