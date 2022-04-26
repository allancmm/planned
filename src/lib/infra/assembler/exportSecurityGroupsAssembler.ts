import Company from '../../domain/entities/company';
import ExportSecurityGroupsRequest from '../../domain/entities/exportSecurityGroupsRequest';
import SecurityGroup from '../../domain/entities/securityGroup';
import { SecurityGroupDataType } from '../../domain/enums/securityGroupDataType';

export const toExportSecurityGroupsRequest = (
    company: Company,
    securityGroupDataType: SecurityGroupDataType,
    securityGroup: SecurityGroup,
    fileName: string,
): ExportSecurityGroupsRequest => {
    return {
        companyGuid: company.companyGuid,
        securityGroupGuid: securityGroup.securityGroupGuid,
        exportSecurityGroupType: securityGroupDataType,
        fileName: fileName,
    };
};
