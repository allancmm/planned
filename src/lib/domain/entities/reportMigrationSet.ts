import { immerable } from "immer";
import MigrationSetContent from "./migrationSetContent";

export default class ReportMigrationSet {
    [immerable] = true;

    public migrationSetGuid: string = '';
    public migrationSetName: string = '';
    public lastModifiedBy: string = '';
    public lastModifiedGMT: string = '';
    public statusCode: string = '';
    public comments: string = '';
    public migrationSetContents: MigrationSetContent[] = [];
}
