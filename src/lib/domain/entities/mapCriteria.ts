import { immerable } from 'immer';

export default class MapCriteria {
    [immerable] = true;

    public mapCriteriaName: string = '';
    public textValue: string = '';
    public mapCriteriaTypeCode: string = '';

    public displayValue?: string;

    public static clone(c: MapCriteria): MapCriteria {
        const newC = new MapCriteria();
        newC.mapCriteriaName = c.mapCriteriaName;
        newC.mapCriteriaTypeCode = c.mapCriteriaTypeCode;
        return newC;
    }
}
