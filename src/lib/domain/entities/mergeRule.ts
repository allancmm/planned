import { Type } from 'class-transformer';
import OipaRule from './oipaRule';

export default class MergeRule {
    @Type(() => OipaRule) public rule: OipaRule = new OipaRule();
    public versionNumberMerged: number = 0;
    public versionNumberSource: number = 0;
    public versionNumberTarget: number = 0;

    public conflictStatus: string = '';

    public artifactPath: string = '';
    public fileTypes: string[] = [];
}
