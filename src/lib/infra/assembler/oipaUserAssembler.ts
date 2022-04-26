import OipaUser from '../../domain/entities/oipaUser';
import { OipaUserCreationRequest } from '../request/oipaUserCreationRequest';
import * as UserSecurityGroupAssembler from './userSecurityGroupAssembler';
import { OipaUserEditionRequest } from '../request/oipaUserEditionRequest';

export const toCreateRequest = (user: OipaUser): OipaUserCreationRequest => {
    const {
        clientNumber,
        firstName,
        lastName,
        sex,
        company,
        localCode,
        password,
        userStatus,
        email,
        userSecurityGroups,
    } = user;

    return {
        clientNumber,
        firstName,
        lastName,
        password,
        userStatus,
        email,
        localeCode: localCode,
        primaryCompanyName: company.companyName,
        gender: sex,
        userSecurityGroups: userSecurityGroups.map(usg => UserSecurityGroupAssembler.toRequest(usg)),
    };
};

export const toEditionRequest = (user: OipaUser): OipaUserEditionRequest => {
    const { firstName, lastName, sex, localCode, password, userStatus, email, userSecurityGroups } = user;

    return {
        firstName,
        lastName,
        password,
        userStatus,
        email,
        localeCode: localCode,
        gender: sex,
        userSecurityGroups: userSecurityGroups.map(usg => UserSecurityGroupAssembler.toRequest(usg)),
    };
};
