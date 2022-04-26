import { Type } from 'class-transformer';
import { SecurityRole } from './securityRole';
import { immerable } from 'immer';

export class User {
    [immerable] = true;

    public userGuid: string = '';
    public userName: string = '';

    public password: string = '';
    public password2: string = '';

    @Type(() => SecurityRole) public securityRole: SecurityRole = new SecurityRole();
}