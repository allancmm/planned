import {immerable} from 'immer';
import OverrideSelector from './overrideSelector';

export default class CreatePlanFundRequest extends OverrideSelector {
    [immerable] = true;
    public fundGUID: string = '';
    public planGUID: string = '';
    public removalPrecedence: number | undefined;
    public removalMethodCode: string = '';
    public depositLevelTracking: string = '';
    public createCheckedOut: boolean = true;    
}