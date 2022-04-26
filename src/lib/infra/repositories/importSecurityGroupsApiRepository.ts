import SecurityGroup from '../../domain/entities/securityGroup';
import { SecurityGroupDataType } from '../../domain/enums/securityGroupDataType';
import ImportSecurityGroupsRepository from '../../domain/repositories/importSecurityGroupsRepository';
import LongJob from '../../domain/util/longJob';
import { ApiGateway } from '../config/apiGateway';
import { HeaderType } from '../config/axiosApiGateway';

export default class ImportSecurityGroupsApiRepository implements ImportSecurityGroupsRepository {
    constructor(private api: ApiGateway) {}

    extractTabNames = async (data: Blob): Promise<SecurityGroupDataType[]> => {
        const tabNames: Promise<string[]> = this.api.postReturnArray(
            `/oipaSecurityGroup/import/tab-names`,
            data,
            undefined,
            'application/octet-stream' as HeaderType,
        );
        return tabNames.then((response: string[]) => {
            return response.map((r: string) => r as SecurityGroupDataType);
        });
    };

    getSecurityGroups = async (data: Blob, securityGroupDataType: SecurityGroupDataType): Promise<SecurityGroup[]> => {
        return this.api.postReturnArray(
            `/oipaSecurityGroup/import/security-groups/${securityGroupDataType}`,
            data,
            { outType: SecurityGroup },
            'application/octet-stream' as HeaderType,
        );
    };

    importSecurityGroupsData = async (
        data: Blob,
        securityGroupDataType: SecurityGroupDataType,
        securityGroup: SecurityGroup,
    ): Promise<LongJob> => {
        return this.api.post(
            `/oipaSecurityGroup/import?securityGroupTabType=${securityGroupDataType}&securityGroupName=${securityGroup.securityGroupName}`,
            data,
            { outType: LongJob },
            'application/octet-stream' as HeaderType,
        );
    };
}
