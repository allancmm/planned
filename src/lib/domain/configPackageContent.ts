import {immerable} from 'immer';
import { EntityType } from './enums/entityType';
import {FileType} from './enums/fileType';

export interface DataByEnvironment {
    [key: string]: { versionGuidByNumber: { [key: string]: string } };
}
/* example:
    {
        "DEV | 01": {
            versionGuidByNumber: {
                "01": "guid"
            }
        }
    }
    */

export default class ConfigPackageContent {
    [immerable] = true;

    public ruleGuid: string = '';
    public ruleName: string = '';
    public ruleType: EntityType = '';
    public overrideName: string = '';
    public fileType: FileType = 'DEFAULT';
    public linkedFiles: FileType[] = [];

    public versionGuid: string = '';
    public currentVersionXMLData: string = '';
    public currentVersionNumber: number = 0;

    public currentCompareData: any;
    public currentDataVersion: any;
    public currentEnvID: any;

    public dataByEnvironment: DataByEnvironment = {};
}
