import { Type } from 'class-transformer';
import DataModel from './dataModel';

export default class DataModelList {
    @Type(() => DataModel) public dataModelFields: DataModel[] = [];

    static empty = (): DataModelList => {
        return new DataModelList();
    };
}
