import { immerable } from "immer";

export default class ConfigPackageContent {
    [immerable] = true;

    public ruleGuid: string = '';
    public ruleName: string = '';
    public versionNumber: string = '';
    public ruleTypeCode: string = '';
}
