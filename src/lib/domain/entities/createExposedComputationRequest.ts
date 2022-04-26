import { immerable } from 'immer';
import OverrideSelector from './overrideSelector';
export default class CreateExposedComputationRequest extends OverrideSelector {
    [immerable] = true;
    public ruleName: string = '';
    public createCheckedOut: boolean = true;
    public computationID: string = '';
}