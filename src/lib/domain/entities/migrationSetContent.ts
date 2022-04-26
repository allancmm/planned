import { immerable } from "immer";
import ConfigPackageContent from "./configPackageContent";

export default class MigrationSetContent {
    [immerable] = true;

    public configPackageGuid: string = '';
    public configPackageName: string = '';
    public statusCode: string = '';
    public creationEnvironment: string = '';
    public creationTrack: string = '';
    public configPackageContents: ConfigPackageContent[] = [];
}
