import Company from './company';
import UserSecurityGroup from './userSecurityGroup';
import { Type } from 'class-transformer';
import { immerable } from 'immer';

export default class OipaUser {
    [immerable] = true;
    public clientGuid: string = '';
    public firstName: string = '';
    public lastName: string = '';
    public sex: string = '';
    public email: string = '';
    public clientNumber: string = '';
    public localCode: string = '';
    public userStatus: string = '';

    public password: string = '';
    public password2: string = '';

    @Type(() => Company) public company: Company = new Company();

    @Type(() => UserSecurityGroup) public userSecurityGroups: UserSecurityGroup[] = [];
}
