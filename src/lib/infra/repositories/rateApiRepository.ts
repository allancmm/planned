import BasicEntity from '../../domain/entities/basicEntity';
import RateList from '../../domain/entities/rateList';
import RateRepository from '../../domain/repositories/rateRepository';
import LongJob from '../../domain/util/longJob';
import Pageable from '../../domain/util/pageable';
import {ApiGateway} from '../config/apiGateway';

export default class RateApiRepository implements RateRepository {
    constructor(private api: ApiGateway) {}

    getRateList = async (rateGroupGuid: string, page: Pageable): Promise<RateList> => {
        return this.api.get(
            `/rates?rateGroupGuid=${rateGroupGuid}&pageNumber=${page.pageNumber}&size=${page.size}`,
            {
                outType: RateList,
            },
        );
    };

    downloadRateExcel = async(completedJob: LongJob, fileName: string) => {
        const blobExcel = await this.api.getBlobData(
            `/rates/export/download?id=${completedJob.jobID}`,
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
    }

    startJobForRateExcel = async (rateGroupGuid: string): Promise<LongJob> => {
        return this.api.get(`/rates/export?rateGroupGuid=${rateGroupGuid}`,{outType: LongJob});
    }

    getRateGroups = async():Promise<BasicEntity[]> => {
        return this.api.getArray(
            `/rates/rateGroups`,
            { outType: BasicEntity },
        );
    }
}