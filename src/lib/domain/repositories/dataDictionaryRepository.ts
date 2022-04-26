import LongJob from '../util/longJob';

export default interface DataDictionaryRepository {
    generateDataDictionary(): Promise<LongJob>;
}
