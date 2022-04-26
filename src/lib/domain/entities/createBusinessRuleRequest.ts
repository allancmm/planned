import { immerable } from 'immer';
import OverrideSelector from './overrideSelector';

export default class CreateBusinessRuleRequest extends OverrideSelector {
    [immerable] = true;

    public businessRuleName: string = '';
    public typeCode: string = '';
    public stateCode?: string;
    public systemCode?: string;
    public templateName?: string;
    public createCheckedOut: boolean = true;
    public selectedContent?: string = '';

    constructor(businessRuleName?: string, overrideGuid?: string, typeCode?: string, overrideLevel?: string, selectedContent?: string) {
        super();
        this.businessRuleName = businessRuleName || '';
        this.overrideGuid = overrideGuid;
        this.overrideLevel = overrideLevel;
        this.typeCode = typeCode|| '';
        this.selectedContent = selectedContent;
    }
}
