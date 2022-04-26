import BasicEntity from '../domain/entities/basicEntity';
import RateList from '../domain/entities/rateList';
import RateRepository from '../domain/repositories/rateRepository';
import LongJob from '../domain/util/longJob';
import Pageable from '../domain/util/pageable';

export default class RateService {
    constructor(private rateRepository: RateRepository) {}

    getRatesPage = async (rateGroupGuid: string, page: Pageable): Promise<RateList> => {
        return this.rateRepository.getRateList(rateGroupGuid, page);
    };

    startJobForRateExcel = async (rateGroupGuid: string): Promise<LongJob> => {
        return this.rateRepository.startJobForRateExcel(rateGroupGuid);
    };

    downloadRateExcel = async (completedJob: LongJob, fileName: string) => {
        this.rateRepository.downloadRateExcel(completedJob, fileName);
    };

    getRateGroups = async (): Promise<BasicEntity[]> => {
        return this.rateRepository.getRateGroups();
    }
}