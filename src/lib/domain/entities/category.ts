import { immerable } from 'immer';

export default class Category {
    [immerable] = true;

    public categoryGUID: string = '';

    public categoryName: string = '';

    public entityTypeCode: string = '';

    public entityGUID: string = '';

    public entitySubTypeCode: string = '';

    public systemCode: string = '';

    public stateCode: string = '';

    public categoryInfo: string = '';

    public override: string = '';

    public entityType: string = '';
}
