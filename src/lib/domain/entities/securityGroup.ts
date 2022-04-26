import Company from "./company";
import { Type } from 'class-transformer';

export default class SecurityGroup {
    public securityGroupGuid: string = '';
    public securityGroupName: string = '';
    @Type(() => Company) public primaryCompany?: Company = new Company();
}
