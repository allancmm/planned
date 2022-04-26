import { immerable } from 'immer';
import OverrideSelector from './overrideSelector';

export default class CreateChartAccountRequest extends OverrideSelector {
    [immerable] = true;

    public accountNumber: string = '';
    public accountDescription: string = '';
    public createCheckedOut: boolean = true;
}