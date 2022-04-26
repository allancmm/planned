import ImportRateRepository from '../../domain/repositories/importRateRepository';
import LongJob from '../../domain/util/longJob';
import { ApiGateway } from '../config/apiGateway';
import { HeaderType } from '../config/axiosApiGateway';

export default class ImportRateApiRepository implements ImportRateRepository {
    constructor(private api: ApiGateway) {}

    extractTabNames = async (data: Blob): Promise<string[]> => {
        return this.api.postReturnArray(
            `/rates/import/tab-names`,
            data,
            undefined,
            'application/octet-stream' as HeaderType,
        );
    };

    importRateData = async (data: Blob, rateDescription: string): Promise<LongJob> => {
        return this.api.post(
            `/rates/import?rateDescription=${rateDescription}`,
            data,
            { outType: LongJob },
            'application/octet-stream' as HeaderType,
        );
    };
}
