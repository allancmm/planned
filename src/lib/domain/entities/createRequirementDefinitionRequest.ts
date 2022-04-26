import { immerable } from 'immer';
import OverrideSelector from './overrideSelector';

export class StateCode {
    public codeValue: string = '';
    public shortDescription: string = '';
}
export class CategoryCode {
    public codeValue: string = '';
    public shortDescription: string = '';
}
export class LevelCode {
    public codeValue: string = '';
    public shortDescription: string = '';
}
export class SeverityCode {
    public codeValue: string = '';
    public shortDescription: string = '';
}


export default class CreateRequirementDefinitionRequest extends OverrideSelector {
    [immerable] = true;

    public requirementName: string = '';
    public description: string = '';
    public manualResult: string = '';
    public categoryCode: string = '';
    public levelCode: string = '';
    public severityCode: string = '';
    public resultsObsoleteDays: string = '';
    public stateCode: string = '';
    public templateName: string = '';
    public attachedRules: string[] = [];
    public createCheckedOut: boolean = true;
}
