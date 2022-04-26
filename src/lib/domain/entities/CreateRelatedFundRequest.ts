import {immerable} from 'immer';
import OverrideSelector from './overrideSelector';

export default class CreateRelatedFundRequest extends OverrideSelector {
    [immerable] = true;
    public fundName: string = '';
    public relationCode: string = '';
    public effectiveDate?: Date;
    public expirationDate?: Date;
    public createCheckedOut: boolean = true;
}