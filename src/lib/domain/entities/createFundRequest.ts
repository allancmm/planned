import { immerable } from 'immer';
import OverrideSelector from './overrideSelector';
export default class CreateFundRequest extends OverrideSelector {
    [immerable] = true;
    public fundName: string = '';
    public typeCode: string = '';
    public currencyCode: string = '';
    public calendarCode: string = '';
    public createCheckedOut: boolean = true;
}