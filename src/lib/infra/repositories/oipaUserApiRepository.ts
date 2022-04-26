import OipaUserRepository from '../../domain/repositories/oipaUserRepository';
import { ApiGateway } from '../config/apiGateway';
import Pageable from '../../domain/util/pageable';
import OipaUserList from '../../domain/entities/oipaUserList';
import OipaUser from '../../domain/entities/oipaUser';
import * as OipaUserAssembler from '../assembler/oipaUserAssembler';
import { OipaUserCreationRequest } from '../request/oipaUserCreationRequest';
import { OipaUserEditionRequest } from '../request/oipaUserEditionRequest';
import SecurityGroupList from "../../domain/entities/securityGroupList";
import CodeList from "../../domain/entities/codeList";

export default class OipaUserApiRepository implements OipaUserRepository {
    constructor(private api: ApiGateway) { }

    getUserList = async (page: Pageable): Promise<OipaUserList> => {
        return this.api.get(`/oipa/users?pageNumber=${page.pageNumber}&size=${page.size}`, { outType: OipaUserList });
    };

    getAllUsernames = async (): Promise<string[]> => {
        return this.api.getArray('/oipa/users/usernames', undefined);
    }

    saveUser = async (user: OipaUser): Promise<OipaUser> => {
        return this.api.put(`/oipa/users/${user.clientNumber}`, OipaUserAssembler.toEditionRequest(user), {
            inType: OipaUserEditionRequest,
            outType: OipaUser,
        });
    };

    createUser = async (user: OipaUser): Promise<OipaUser> => {
        return this.api.post(`/oipa/users`, OipaUserAssembler.toCreateRequest(user), {
            inType: OipaUserCreationRequest,
            outType: OipaUser,
        });
    };

    deleteUser = async (user: OipaUser): Promise<void> => {
        return this.api.delete(`/oipa/users/${user.clientNumber}`);
    };

    getSecurityGroups = async (): Promise<SecurityGroupList> => {
        return this.api.get(`/oipa/users/securityGroups`, { outType: SecurityGroupList });
    };

    getSecurityGroupsAndCompany = async (): Promise<SecurityGroupList> => {
        return this.api.get(`/oipa/users/securityGroupsAndCompany`, { outType: SecurityGroupList });
    };

    getLocaleCodes = async (): Promise<CodeList> => {
        return this.api.get(`/oipa/users/localeCodes`, { outType: CodeList });
    };

    inactivateUser = async (user: OipaUser): Promise<OipaUser> => {
        return this.api.put(`/oipa/users/inactivate/${user.clientNumber}`, { outType: OipaUser });
    }

    getUserByLoginName = async (searchParam: string): Promise<OipaUser[]> => {
        return this.api.getArray(`/oipa/users/search?searchParam=${searchParam}`, { outType: OipaUser });
    }
}
