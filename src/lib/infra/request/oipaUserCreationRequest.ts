import { UserSecurityGroupRequest } from './userSecurityGroupCreationRequest';

export class OipaUserCreationRequest {
    public clientNumber: string = '';
    public firstName: string = '';
    public lastName: string = '';
    public gender: string = '';
    public primaryCompanyName: string = '';
    public localeCode: string = '';
    public password: string = '';
    public userSecurityGroups: UserSecurityGroupRequest[] = [];
    public userStatus: string = '';
    public email: string = '';
}
