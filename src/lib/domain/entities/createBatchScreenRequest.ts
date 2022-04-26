import { immerable } from 'immer';
import OverrideSelector from './overrideSelector';

export default class CreateBatchScreenRequest extends OverrideSelector {
    [immerable] = true;

    public relatedGuid: string = '';
    public screenName: string = '';
    public typeCode: string = '';
    public createCheckedOut: boolean = true;
}