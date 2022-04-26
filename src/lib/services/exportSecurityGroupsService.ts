import Company from '../domain/entities/company';
import SecurityGroup from '../domain/entities/securityGroup';
import { SecurityGroupDataType } from '../domain/enums/securityGroupDataType';
import ExportSecurityGroupsRepository from '../domain/repositories/exportSecurityGroupsRepository';
import LongJob from '../domain/util/longJob';

export default class ExportSecurityGroupsService {
    constructor(private exportSecurityGroupsRepository: ExportSecurityGroupsRepository) {}

    getSecurityGroups = async (companyGuid: string): Promise<SecurityGroup[]> => {
        return this.exportSecurityGroupsRepository.getSecurityGroups(companyGuid);
    };

    exportSecurityGroupsData = async (
        company: Company,
        securityGroupDataType: SecurityGroupDataType,
        securityGroup: SecurityGroup,
        fileName: string,
    ): Promise<LongJob> => {
        return this.exportSecurityGroupsRepository.exportSecurityGroupsData(
            company,
            securityGroupDataType,
            securityGroup,
            fileName,
        );
    };

    getSecurityGroupDataAsExcel = async (completedJob: LongJob, fileName: string) => {
        this.exportSecurityGroupsRepository.getSecurityGroupDataAsExcel(completedJob, fileName);
    };
}
