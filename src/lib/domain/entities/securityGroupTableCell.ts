import { immerable } from 'immer';

export class SecurityGroupTableCell {
    [immerable] = true;
    public columnName: string = '';
    public cellValue: string = '';
    public renderColumn: boolean = true;
    public isUnmodifiable: boolean = true;
}
