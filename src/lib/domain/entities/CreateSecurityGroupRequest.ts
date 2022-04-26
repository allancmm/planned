import { immerable } from "immer";

export default class CreateSecurityGroupRequest  {
    [immerable] = true;

    public option: string = '';
    public securityGroupName: string = '';
}