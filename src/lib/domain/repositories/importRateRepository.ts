import LongJob from '../util/longJob';

export default interface ImportRateRepository {
    extractTabNames(data: Blob): Promise<string[]>;

    importRateData(data: Blob, rateDescription: string): Promise<LongJob>;
}
