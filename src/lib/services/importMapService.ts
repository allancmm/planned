import ImportMapRepository from '../domain/repositories/importMapRepository';
import LongJob from '../domain/util/longJob';

export default class ImportMapService {
    constructor(private importMapRepository: ImportMapRepository) {}

    extractTabNames = async (data: Blob): Promise<string[]> => {
        return this.importMapRepository.extractTabNames(data);
    };

    importMapData = async (data: Blob, mapName: string): Promise<LongJob> => {
        return this.importMapRepository.importMapData(data, mapName);
    };
}
