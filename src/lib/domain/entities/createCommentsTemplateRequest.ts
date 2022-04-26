import { immerable } from 'immer';
import OverrideSelector from './overrideSelector';

export default class CreateCommentsTemplateRequest extends OverrideSelector {
    [immerable] = true;

    public templateName: string = ''
    public templateText: string = ''

}