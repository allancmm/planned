import Company from '../../domain/entities/company';
import ExportSecurityGroupsRequest from '../../domain/entities/exportSecurityGroupsRequest';
import SecurityGroup from '../../domain/entities/securityGroup';
import { SecurityGroupDataType } from '../../domain/enums/securityGroupDataType';
import ExportSecurityGroupsRepository from '../../domain/repositories/exportSecurityGroupsRepository';
import LongJob from '../../domain/util/longJob';
import * as ExportSecurityGroupsAssembler from '../assembler/exportSecurityGroupsAssembler';
import { ApiGateway } from '../config/apiGateway';

export default class ExportSecurityGroupsApiRepository implements ExportSecurityGroupsRepository {
    constructor(private api: ApiGateway) {}

    getSecurityGroups = async (companyGuid: string): Promise<SecurityGroup[]> => {
        return this.api.getArray(`/oipaSecurityGroup/export/security-groups/${companyGuid}`, {
            outType: SecurityGroup,
        });
    };

    exportSecurityGroupsData = async (
        company: Company,
        securityGroupDataType: SecurityGroupDataType,
        securityGroup: SecurityGroup,
        fileName: string,
    ): Promise<LongJob> => {
        return this.api.post(
            `/oipaSecurityGroup/export`,
            ExportSecurityGroupsAssembler.toExportSecurityGroupsRequest(
                company,
                securityGroupDataType,
                securityGroup,
                fileName,
            ),
            { inType: ExportSecurityGroupsRequest, outType: LongJob },
        );
    };

    getSecurityGroupDataAsExcel = async (completedJob: LongJob, fileName: string) => {
        const blobExcel = await this.api.getBlobData(
            `/oipaSecurityGroup/export/download?id=${completedJob.jobID}`,
            'application/json',
            'application/vnd.ms-excel',
        );
        const downloadURL = window.URL.createObjectURL(blobExcel);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.setAttribute('download', `${fileName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };
}
