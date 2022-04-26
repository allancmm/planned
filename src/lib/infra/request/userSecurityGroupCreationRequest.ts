export class UserSecurityGroupRequest {
    public securityGroupName: string = '';
    public effectiveFrom?: Date = new Date();
    public effectiveTo?: Date = new Date();
}
