import SecurityGroup from './securityGroup';
import { Type } from 'class-transformer';

export default class SecurityGroupList {
    @Type(() => SecurityGroup) public securityGroups: SecurityGroup[] = [];

    static empty = (): SecurityGroupList => {
        return new SecurityGroupList();
    };
}
