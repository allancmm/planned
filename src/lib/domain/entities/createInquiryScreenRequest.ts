import { immerable } from 'immer';
import OverrideSelector from './overrideSelector';

export default class CreateInquiryScreenRequest extends OverrideSelector {
    [immerable] = true;
    public name: string = '';
    public createCheckedOut: boolean = true;
    public typeCode: string = '';    
    public templateName?: string;
    public securityGroupGuid?: string;
    public override?: string;
    public stateCode?: string;
}
