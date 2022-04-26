import Company from '../entities/company';
import SecurityGroup from '../entities/securityGroup';
import { SecurityGroupDataType } from '../enums/securityGroupDataType';
import LongJob from '../util/longJob';

export default interface ExportSecurityGroupsRepository {
    getSecurityGroups(companyGuid: string): Promise<SecurityGroup[]>;

    exportSecurityGroupsData(
        company: Company,
        securityGroupDataType: SecurityGroupDataType,
        securityGroup: SecurityGroup,
        fileName: string,
    ): Promise<LongJob>;

    getSecurityGroupDataAsExcel(completedJob: LongJob, fileName: string): void;
}
