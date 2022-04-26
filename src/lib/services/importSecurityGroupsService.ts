import ImportSecurityGroupsRepository from '../domain/repositories/importSecurityGroupsRepository';
import { SecurityGroupDataType } from '../domain/enums/securityGroupDataType';
import SecurityGroup from '../domain/entities/securityGroup';
import LongJob from '../domain/util/longJob';

export default class ImportSecurityGroupsService {
    constructor(private importSecurityGroupsRepository: ImportSecurityGroupsRepository) {}

    extractTabNames = async (data: Blob): Promise<SecurityGroupDataType[]> => {
        return this.importSecurityGroupsRepository.extractTabNames(data);
    };

    getSecurityGroups = async (data: Blob, securityGroupDataType: SecurityGroupDataType): Promise<SecurityGroup[]> => {
        return this.importSecurityGroupsRepository.getSecurityGroups(data, securityGroupDataType);
    };

    importSecurityGroupsData = async (
        data: Blob,
        securityGroupDataType: SecurityGroupDataType,
        securityGroup: SecurityGroup,
    ): Promise<LongJob> => {
        return this.importSecurityGroupsRepository.importSecurityGroupsData(data, securityGroupDataType, securityGroup);
    };
}
