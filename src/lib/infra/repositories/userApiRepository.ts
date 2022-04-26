import UserRepository from '../../domain/repositories/userRepository';
import PrivilegeList from '../../domain/entities/privilegeList';
import { SecurityRole } from '../../domain/entities/securityRole';
import SecurityRoleList from '../../domain/entities/securityRoleList';
import { User } from '../../domain/entities/user';
import UserList from '../../domain/entities/userList';
import Pageable from '../../domain/util/pageable';
import { ApiGateway } from '../config/apiGateway';
import * as UserAdminAssembler from '../assembler/userAdminAssembler';
import { UserSecurityRoleCreationRequest } from '../request/userSecurityRoleCreationRequest';
import { UserSecurityRoleEditionRequest } from '../request/userSecurityRoleEditionRequest';
import { UserCreationRequest } from '../request/userCreationRequest';
import { UserEditionRequest } from '../request/userEditionRequest';
import {UserPasswordEditionRequest} from "../request/userPasswordEditionRequest";

export default class UserApiRepository implements UserRepository {
    constructor(private api: ApiGateway) {}

    getUserList = async (searchParam: string, page: Pageable): Promise<UserList> => {
        return this.api.get(`/users?searchParam=${searchParam}&pageNumber=${page.pageNumber}&size=${page.size}`, { outType: UserList });
    };

    createUser = async (user: User): Promise<User> => {
        return this.api.post(`/users`, UserAdminAssembler.toUserCreateRequest(user), {
            inType: UserCreationRequest,
            outType: User,
        });
    };

    editUser = async (username: string, newRoleName: string): Promise<User> => {
        return this.api.put(`/users/${username}`, UserAdminAssembler.toUserEditionRequest(newRoleName), {
            inType: UserEditionRequest,
            outType: User,
        });
    };

    deleteUser = async (username: string): Promise<void> => {
        return this.api.delete(`/users/${username}`);
    };

    getSecurityRolePage = async (page: Pageable): Promise<SecurityRoleList> => {
        return this.api.get(`/users/roles?pageNumber=${page.pageNumber}&size=${page.size}`, {
            outType: SecurityRoleList,
        });
    };

    getSecurityRoleUsers = async (roleName: string): Promise<string[]> => {
        return this.api.getArray(`/users/roles/${roleName}`);
    };

    getPrivilegeList = async (): Promise<PrivilegeList> => {
        return this.api.get(`/users/privileges`, { outType: PrivilegeList });
    };

    createSecurityRole = async (securityRole: SecurityRole): Promise<SecurityRole> => {
        return this.api.post(`/users/roles`, UserAdminAssembler.toSecurityRoleCreationRequest(securityRole), {
            inType: UserSecurityRoleCreationRequest,
            outType: SecurityRole,
        });
    };

    editSecurityRole = async (roleName: string, securityRole: SecurityRole): Promise<SecurityRole> => {
        return this.api.put(
            `/users/roles/${roleName}`,
            UserAdminAssembler.toUserSecurityRoleEditionRequest(securityRole),
            { inType: UserSecurityRoleEditionRequest, outType: SecurityRole },
        );
    };

    deleteSecurityRole = async (roleName: string): Promise<void> => {
        return this.api.delete(`/users/roles/${roleName}`);
    };

    updateUserPassword = async (username: string, userPassword: UserPasswordEditionRequest) : Promise<void> =>
        this.api.post(`/users/${username}/password`, userPassword, { inType: UserPasswordEditionRequest } )
}
