import UserSecurityGroup from '../../domain/entities/userSecurityGroup';
import { UserSecurityGroupRequest } from '../request/userSecurityGroupCreationRequest';

export const toRequest = (sg: UserSecurityGroup): UserSecurityGroupRequest => {
    const { securityGroupName, effectiveFrom, effectiveTo } = sg;
    return { securityGroupName, effectiveFrom, effectiveTo };
};
