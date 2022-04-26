import {immerable} from 'immer';
import OverrideSelector from './overrideSelector';

export default class CreateIntakeProfileDefinitionRequest extends OverrideSelector {
    [immerable] = true;

    public profileDefinitionName: string = '';
    public typeCode: string = '';
    public createCheckedOut: boolean = true;
}
