import { SecurityGroupDataType } from "../enums/securityGroupDataType";

export default class ExportSecurityGroupsRequest {
    public companyGuid: string = '';
    public securityGroupGuid: string = '';
    public fileName: string = '';
    public exportSecurityGroupType: SecurityGroupDataType = '';
}
