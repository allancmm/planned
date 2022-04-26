import BasicEntity from './basicEntity';
import { Type } from 'class-transformer';

export default class DebuggerEntity {
    public guid: string = '';
    public displayName: string = '';
    @Type(() => BasicEntity) public extraInformation: BasicEntity[] = [];
}
