import { immerable } from 'immer';
import Category from './category';

export default class DataModel {
    [immerable] = true;

    public dataModelGUID: string = '';

    public categoryGUID: string = '';

    public fieldName: string = '';

    public fieldId: string = '';

    public dataType: string = '';

    public displayName: string = '';

    public fieldType: string = '';

    public multifield: string = '';

    public description: string = '';

    public category: Category | null = null;
}
