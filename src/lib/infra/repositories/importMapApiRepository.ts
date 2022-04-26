import ImportMapRepository from '../../domain/repositories/importMapRepository';
import LongJob from '../../domain/util/longJob';
import { ApiGateway } from '../config/apiGateway';
import { HeaderType } from '../config/axiosApiGateway';

export default class ImportMapApiRepository implements ImportMapRepository {
    constructor(private api: ApiGateway) {}

    extractTabNames = async (data: Blob): Promise<string[]> => {
        return this.api.postReturnArray(
            `/map/import/tab-names`,
            data,
            undefined,
            'application/octet-stream' as HeaderType,
        );
    };

    importMapData = async (data: Blob, mapName: string): Promise<LongJob> => {
        return this.api.post(
            `/map/import?mapName=${mapName}`,
            data,
            { outType: LongJob },
            'application/octet-stream' as HeaderType,
        );
    };
}
