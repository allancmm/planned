import BasicEntity from '../entities/basicEntity';
import LongJob from '../util/longJob';

export default interface ExportMapRepository {
    getMaps(): Promise<BasicEntity[]>;

    exportMapData(mapName: string): Promise<LongJob>;

    getMapDataAsExcel(completedJob: LongJob, fileName: string): void;
}
