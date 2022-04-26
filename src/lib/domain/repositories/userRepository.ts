import PrivilegeList from '../entities/privilegeList';
import { SecurityRole } from '../entities/securityRole';
import SecurityRoleList from '../entities/securityRoleList';
import {User} from '../entities/user';
import UserList from '../entities/userList';
import Pageable from '../util/pageable';
import {UserPasswordEditionRequest} from "../../infra/request/userPasswordEditionRequest";

export default interface UserRepository {
    getUserList(searchParam: string, page: Pageable): Promise<UserList>;

    createUser(user: User): Promise<User>;

    editUser(username: string, newRoleName: string): Promise<User>;

    deleteUser(username: string): Promise<void>;

    getSecurityRolePage(page: Pageable): Promise<SecurityRoleList>;

    getSecurityRoleUsers(roleName: string): Promise<string[]>;

    getPrivilegeList(): Promise<PrivilegeList>;

    createSecurityRole(securityRole: SecurityRole): Promise<SecurityRole>;

    editSecurityRole(roleName: string, securityRole: SecurityRole): Promise<SecurityRole>;

    deleteSecurityRole(roleName: string): Promise<void>;

    updateUserPassword(username: string, userPassword: UserPasswordEditionRequest): Promise<void>;
}
