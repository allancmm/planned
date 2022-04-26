import { Type } from "class-transformer";
import { immerable } from 'immer';
import { SecurityGroupDataType } from '../enums/securityGroupDataType';
import { SecurityGroupTableCell } from './securityGroupTableCell';

export default class SecurityGroupTableRow {
    [immerable] = true;
    public rowGuidKey: string = '';
    public securityGroupDataType: SecurityGroupDataType = '';
    @Type(() => SecurityGroupTableCell) public tableCells: SecurityGroupTableCell[] = [];
}
