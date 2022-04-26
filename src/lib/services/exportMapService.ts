import BasicEntity from '../domain/entities/basicEntity';
import ExportMapRepository from '../domain/repositories/exportMapRepository';
import LongJob from '../domain/util/longJob';

export default class ExportMapService {
    constructor(private exportMapRepository: ExportMapRepository) {}

    getMaps = async (): Promise<BasicEntity[]> => {
        return this.exportMapRepository.getMaps();
    };

    exportMapData = async (mapName: string): Promise<LongJob> => {
        return this.exportMapRepository.exportMapData(mapName);
    };

    getMapDataAsExcel = async (completedJob: LongJob, fileName: string) => {
        this.exportMapRepository.getMapDataAsExcel(completedJob, fileName);
    };
}
