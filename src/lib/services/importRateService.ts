import ImportRateRepository from '../domain/repositories/importRateRepository';
import LongJob from '../domain/util/longJob';

export default class ImportRateService {
    constructor(private importRateRepository: ImportRateRepository) {}

    extractTabNames = async (data: Blob): Promise<string[]> => {
        return this.importRateRepository.extractTabNames(data);
    };

    importRateData = async (data: Blob, rateDescription: string): Promise<LongJob> => {
        return this.importRateRepository.importRateData(data, rateDescription);
    };
}
