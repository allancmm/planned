import { GenerateDataDictionaryRequest } from '../request/generateDataDictionaryRequest';

export const togenerateDataDictionaryRequest = (target: string): GenerateDataDictionaryRequest => {
    return { targetEnvironmentId: target };
};
