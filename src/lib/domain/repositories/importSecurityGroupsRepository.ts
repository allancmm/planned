import SecurityGroup from '../entities/securityGroup';
import { SecurityGroupDataType } from '../enums/securityGroupDataType';
import LongJob from '../util/longJob';

export default interface ImportSecurityGroupsRepository {
    extractTabNames(data: Blob): Promise<SecurityGroupDataType[]>;

    getSecurityGroups(data: Blob, securityGroupDataType: SecurityGroupDataType): Promise<SecurityGroup[]>;

    importSecurityGroupsData(
        data: Blob,
        securityGroupDataType: SecurityGroupDataType,
        securityGroup: SecurityGroup,
    ): Promise<LongJob>;
}
