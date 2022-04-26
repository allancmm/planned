import { Expose, Type } from 'class-transformer';
import Privilege from './privilege';
import { immerable } from 'immer';

export class SecurityRole {
    [immerable] = true;
    public securityRoleGuid: string = '';
    public securityRoleName: string = '';
    public environment: string = '';
    public track: string = '';
    @Expose({ groups: ['cache'] }) public users: string[] = [];

    @Type(() => Privilege) public privileges: Privilege[] = [];

    constructor(securityRoleName?: string) {
        this.securityRoleName = securityRoleName || "";
    }
}
