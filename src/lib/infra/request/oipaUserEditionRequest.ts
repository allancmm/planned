import { UserSecurityGroupRequest } from './userSecurityGroupCreationRequest';

export class OipaUserEditionRequest {
    public firstName: string = '';
    public lastName: string = '';
    public gender: string = '';
    public email: string = '';
    public localeCode: string = '';
    public password: string = '';
    public userSecurityGroups: UserSecurityGroupRequest[] = [];
    public userStatus: string = '';
}
