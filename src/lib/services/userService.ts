import { ErrorInformation } from '../domain/entities/apiError';
import PrivilegeList from '../domain/entities/privilegeList';
import { SecurityRole } from '../domain/entities/securityRole';
import SecurityRoleList from '../domain/entities/securityRoleList';
import { User } from '../domain/entities/user';
import UserList from '../domain/entities/userList';
import UserRepository from '../domain/repositories/userRepository';
import Pageable from '../domain/util/pageable';
import { nullOrEmpty } from '../util/stringUtil';
import { UserPasswordEditionRequest } from "../infra/request/userPasswordEditionRequest";
import { ErrorValidation } from "../domain/entities/errorValidation";
import { MSG_DIFFERENT_PASSWORDS, MSG_MIN_LENGTH_PASSWORD, MSG_REQUIRED_FIELD, MSG_SAME_PASSWORDS } from "../constants";

const MIN_LENGTH_PASSWORD = 8;

export default class UserService {
    constructor(private userRepository: UserRepository) {}

    validateUser = (user: User): ErrorInformation[] => {
        const errors: ErrorInformation[] = [];

        if (nullOrEmpty(user.userName)) {
            errors.push({ message: 'form.invalid', extraInformation: 'admin.validation.username' });
        }

        if (!nullOrEmpty(user.password)) {
            if (!user.password || user.password.trim().length < 6) {
                errors.push({ message: 'form.invalid', extraInformation: 'admin.changePassword.passwordMandatory' });
            }

            if (user.password !== user.password2) {
                errors.push({ message: 'form.invalid', extraInformation: 'admin.changePassword.passwordMandatory' });
            }
        } else {
            errors.push({ message: 'form.invalid', extraInformation: 'admin.changePassword.passwordMandatory' });
        }

        return errors;
    };

    validateSecurityRole = (role: SecurityRole): ErrorInformation[] => {
        const errors: ErrorInformation[] = [];

        if (nullOrEmpty(role.securityRoleName)) {
            errors.push({ message: 'form.invalid', extraInformation: 'admin.validation.securityRoleName' });
        }

        return errors;
    };

    validatePasswordSameUser = (userPassword: UserPasswordEditionRequest) : ErrorValidation =>
        Object.keys(userPassword).reduce((error: ErrorValidation, key ) => {
            let msg;
            switch (key) {
                case 'currentPassword':
                    msg = !userPassword[key] && MSG_REQUIRED_FIELD;
                    break;
                case 'newPassword': {
                    if (!userPassword.newPassword) {
                        msg = MSG_REQUIRED_FIELD;
                        break;
                    }
                    if(userPassword.newPassword.length < MIN_LENGTH_PASSWORD) {
                        msg = MSG_MIN_LENGTH_PASSWORD;
                        break;
                    }
                    if(userPassword.currentPassword === userPassword.newPassword){
                        msg = MSG_SAME_PASSWORDS;
                        break;
                    }
                    break;
                }
                case 'confirmPassword':
                    msg = userPassword.confirmPassword ?
                        userPassword.newPassword !== userPassword.confirmPassword ?
                            MSG_DIFFERENT_PASSWORDS : null : MSG_REQUIRED_FIELD;
                    break;
                default: return error;
            }
            return {...error, hasError: error.hasError || !!msg, messages: {...error.messages, [key]: msg}};
        }, new ErrorValidation());

    validatePasswordDifferentUser = (password: string) : ErrorValidation => {
        const errorValidation = new ErrorValidation();
        if(!password){
            errorValidation.hasError = true;
            errorValidation.messages = { password: MSG_REQUIRED_FIELD };
        }

        if(password?.length < MIN_LENGTH_PASSWORD){
            errorValidation.hasError = true;
            errorValidation.messages = { password: MSG_MIN_LENGTH_PASSWORD };
        }
        return errorValidation;
    };

    getUserList = async (searchParam: string, page: Pageable): Promise<UserList> => {
        return this.userRepository.getUserList(searchParam, page);
    };

    createUser = async (user: User): Promise<User> => {
        return this.userRepository.createUser(user);
    };

    editUser = async (username: string, newRoleName: string): Promise<User> => {
        return this.userRepository.editUser(username, newRoleName);
    };

    deleteUser = async (username: string): Promise<void> => {
        return this.userRepository.deleteUser(username);
    };

    getSecurityRolePage = async (page: Pageable): Promise<SecurityRoleList> => {
        return this.userRepository.getSecurityRolePage(page);
    };

    getSecurityRoleUsers = async (roleName: string): Promise<string[]> => {
        return this.userRepository.getSecurityRoleUsers(roleName);
    };

    getPrivilegeList = async (): Promise<PrivilegeList> => {
        return this.userRepository.getPrivilegeList();
    };

    createSecurityRole = async (securityRole: SecurityRole): Promise<SecurityRole> => {
        return this.userRepository.createSecurityRole(securityRole);
    };

    editSecurityRole = async (roleName: string, securityRole: SecurityRole): Promise<SecurityRole> => {
        return this.userRepository.editSecurityRole(roleName, securityRole);
    };

    deleteSecurityRole = async (roleName: string): Promise<void> => {
        return this.userRepository.deleteSecurityRole(roleName);
    };

    updateUserPassword = async (username: string, userPassword: UserPasswordEditionRequest) : Promise<void> =>
        this.userRepository.updateUserPassword(username, userPassword);
}
