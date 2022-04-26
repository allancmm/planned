import BasicEntity from '../entities/basicEntity';
import RateList from '../entities/rateList';
import LongJob from '../util/longJob';
import Pageable from '../util/pageable';

export default interface RateRepository {
    getRateList(rateGroupGuid: string, page: Pageable): Promise<RateList>;

    startJobForRateExcel(rateGroupGuid: string): Promise<LongJob>;

    downloadRateExcel(completedJob: LongJob, fileName: string): void;

    getRateGroups(): Promise<BasicEntity[]>;
}