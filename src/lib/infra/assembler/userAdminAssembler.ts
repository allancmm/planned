import Privilege from '../../domain/entities/privilege';
import {SecurityRole} from '../../domain/entities/securityRole';
import {User} from '../../domain/entities/user';
import {UserSecurityRoleCreationRequest} from '../request/userSecurityRoleCreationRequest';
import {UserCreationRequest} from '../request/userCreationRequest';
import {UserEditionRequest} from '../request/userEditionRequest';
import {UserSecurityRoleEditionRequest} from '../request/userSecurityRoleEditionRequest';

export const toUserCreateRequest = (user: User): UserCreationRequest => {
    return {
        username: user.userName,
        password: user.password,
        securityRoleName: user.securityRole.securityRoleName
    };
};

export const toUserEditionRequest = (newRoleName: string): UserEditionRequest => {
  return {
    newRoleName : newRoleName
  };
};

export const toSecurityRoleCreationRequest = (role: SecurityRole): UserSecurityRoleCreationRequest => {
  return {
      securityRoleName: role.securityRoleName,
      privileges: role.privileges.map((privilege: Privilege) => privilege.privilegeName)
  }
};

export const toUserSecurityRoleEditionRequest = (role: SecurityRole): UserSecurityRoleEditionRequest => {
  return {
      newRoleName: role.securityRoleName,
      privileges: role.privileges.map((privilege: Privilege) => privilege.privilegeName)
  }
};

