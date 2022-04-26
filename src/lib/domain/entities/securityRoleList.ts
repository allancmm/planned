import { Type } from 'class-transformer';
import Pageable from '../util/pageable';
import { SecurityRole } from './securityRole';

export default class SecurityRoleList {
    @Type(() => SecurityRole) public securityRoles: SecurityRole[] = [];
    @Type(() => Pageable) public page: Pageable = new Pageable();

    static empty(): SecurityRoleList {
        return new SecurityRoleList();
    }

    hasNextPage(): boolean {
        return !this.page.isLast();
    }

    hasPreviousPage(): boolean {
        return !this.page.isFirst();
    }
}
