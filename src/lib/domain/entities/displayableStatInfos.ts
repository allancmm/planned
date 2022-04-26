import { Transform } from 'class-transformer';
import { immerable } from 'immer';
import { v4 as uuid } from 'uuid';
import { convertDate } from '../../util/transform';
import { EntityType } from '../enums/entityType';
export default class DisplayableStatInfos {
    [immerable] = true;
    public guid: string = uuid();
    public username: string = '';
    public activityType: string = '';
    @Transform(convertDate) public date: Date = new Date();
    public elementType: string = '';
    public entityType: EntityType = '';
    public elementGuid: string = '';
    public elementName: string = '';
}
