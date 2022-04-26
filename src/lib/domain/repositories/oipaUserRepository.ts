import Pageable from '../util/pageable';
import OipaUserList from '../entities/oipaUserList';
import OipaUser from '../entities/oipaUser';
import SecurityGroupList from "../entities/securityGroupList";
import CodeList from "../entities/codeList";

export default interface OipaUserRepository {
    getUserList(page: Pageable): Promise<OipaUserList>;

    getAllUsernames(): Promise<string[]>;

    saveUser(user: OipaUser): Promise<OipaUser>;

    createUser(user: OipaUser): Promise<OipaUser>;

    deleteUser(user: OipaUser): Promise<void>;

    getSecurityGroups(): Promise<SecurityGroupList>;

    getSecurityGroupsAndCompany(): Promise<SecurityGroupList>;

    getLocaleCodes(): Promise<CodeList>;

    inactivateUser(user: OipaUser): Promise<OipaUser>;

    getUserByLoginName(searchParam: string): Promise<OipaUser[]>;
}
