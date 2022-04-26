import { Transform } from 'class-transformer';
import { convertDate } from '../../util/transform';
import { immerable } from 'immer';

export default class UserSecurityGroup {
    [immerable] = true;
    public clientGuid: string = '';
    public securityGroupGuid: string = '';
    public securityGroupName: string = '';
    @Transform(convertDate)
    public effectiveFrom?: Date = new Date();
    @Transform(convertDate)
    public effectiveTo?: Date = new Date();
}
