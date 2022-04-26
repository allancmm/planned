import ExportSecurityGroupsRequest from '../../domain/entities/exportSecurityGroupsRequest';
import BasicEntity from '../../domain/entities/basicEntity';
import ExportMapRepository from '../../domain/repositories/exportMapRepository';
import LongJob from '../../domain/util/longJob';
import { ApiGateway } from '../config/apiGateway';

export default class ExportMapApiRepository implements ExportMapRepository {
    constructor(private api: ApiGateway) {}

    getMaps = async (): Promise<BasicEntity[]> => {
        return this.api.getArray(`/map/export/maps`, {
            outType: BasicEntity,
        });
    };

    exportMapData = async (mapName: string): Promise<LongJob> => {
        return this.api.post(
            `/map/export`,
            { mapName: mapName },
            { inType: ExportSecurityGroupsRequest, outType: LongJob },
        );
    };

    getMapDataAsExcel = async (completedJob: LongJob, fileName: string) => {
        const blobExcel = await this.api.getBlobData(
            `/map/export/download?id=${completedJob.jobID}`,
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
