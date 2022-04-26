import { ErrorInformation } from '../domain/entities/apiError';
import OipaUser from '../domain/entities/oipaUser';
import OipaUserList from '../domain/entities/oipaUserList';
import UserSecurityGroup from '../domain/entities/userSecurityGroup';
import OipaUserRepository from '../domain/repositories/oipaUserRepository';
import Pageable from '../domain/util/pageable';
import { nullOrEmpty } from '../util/stringUtil';
import SecurityGroupList from "../domain/entities/securityGroupList";
import CodeList from "../domain/entities/codeList";

export default class OipaUserService {
    constructor(private userRepository: OipaUserRepository) {}

    validate = (user: OipaUser, editMode: boolean): ErrorInformation[] => {
        const errors: ErrorInformation[] = [];
        if (editMode) {
            if (!nullOrEmpty(user.password)) {
                if (user.password !== user.password2) {
                    errors.push({
                        message: 'form.invalid',
                        extraInformation: 'admin.changePassword.passwordMandatory',
                    });
                }
            }
        } else {
            if (!user.password || user.password.trim().length < 6) {
                errors.push({ message: 'form.invalid', extraInformation: 'admin.changePassword.passwordMandatory' });
            }

            if (user.password !== user.password2) {
                errors.push({ message: 'form.invalid', extraInformation: 'admin.changePassword.passwordMandatory' });
            }
        }

        if (nullOrEmpty(user.firstName)) {
            errors.push({ message: 'form.invalid', extraInformation: 'admin.validation.firstName' });
        }
        if (nullOrEmpty(user.lastName)) {
            errors.push({ message: 'form.invalid', extraInformation: 'admin.validation.lastName' });
        }
        if (nullOrEmpty(user.clientNumber)) {
            errors.push({ message: 'form.invalid', extraInformation: 'admin.validation.clientNumber' });
        }
        if (nullOrEmpty(user.company.companyGuid)) {
            errors.push({ message: 'form.invalid', extraInformation: 'admin.validation.primaryCompanyName' });
        }
        if (nullOrEmpty(user.localCode)) {
            errors.push({ message: 'form.invalid', extraInformation: 'admin.validation.localeCode' });
        }
        if (user.userSecurityGroups.filter((sg: UserSecurityGroup) => !sg.effectiveFrom).length !== 0) {
            errors.push({ message: 'form.invalid', extraInformation: 'admin.validation.clientNumber' });
        }

        const securityGroupsByGuid = user.userSecurityGroups.map((sg: UserSecurityGroup) => sg.securityGroupGuid);

        if (new Set(securityGroupsByGuid).size < securityGroupsByGuid.length) {
            errors.push({ message: 'form.invalid', extraInformation: 'admin.validation.userSecurityGroups' });
        }
        return errors;
    };

    getUserList = async (page: Pageable): Promise<OipaUserList> => {
        return this.userRepository.getUserList(page);
    };

    getUserListForSelect = async (
        page: Pageable,
        _:string
    ): Promise<OipaUserList> => {
        return this.userRepository.getUserList(page);
    };

    getAllDevelopUsernames = async (): Promise<string[]> => {
        return this.userRepository.getAllUsernames();
    };

    createUser = async (user: OipaUser): Promise<OipaUser> => {
        return this.userRepository.createUser(user);
    };

    saveUser = async (user: OipaUser): Promise<OipaUser> => {
        return this.userRepository.saveUser(user);
    };

    deleteUser = async (user: OipaUser): Promise<void> => {
        return this.userRepository.deleteUser(user);
    };

    getSecurityGroups = async (): Promise<SecurityGroupList> => {
        return this.userRepository.getSecurityGroups();
    };

    getSecurityGroupsAndCompany = async (): Promise<SecurityGroupList> => {
        return this.userRepository.getSecurityGroupsAndCompany();
    };

    getLocaleCodes = async () : Promise<CodeList> => {
        return this.userRepository.getLocaleCodes();
    }

    inactivateUser = async (user: OipaUser) => {
        return this.userRepository.inactivateUser(user);
    }

    getUserByLoginName = async (searchParam: string) : Promise<OipaUser[]> => {
        return this.userRepository.getUserByLoginName(searchParam);
    }
}
