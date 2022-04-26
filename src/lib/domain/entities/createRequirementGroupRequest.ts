import {immerable} from 'immer';
import OverrideSelector from './overrideSelector';

export default class CreateRequirementGroupRequest extends OverrideSelector {
    [immerable] = true;

    public requirementGroupName: string = '';
    public createCheckedOut: boolean = true;
}
