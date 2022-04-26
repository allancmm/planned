import LongJob from '../util/longJob';

export default interface ImportMapRepository {
    extractTabNames(data: Blob): Promise<string[]>;

    importMapData(data: Blob, mapName: string): Promise<LongJob>;
}
