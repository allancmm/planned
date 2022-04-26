import { Transform } from 'class-transformer';
import { convertDate } from '../../util/transform';
export default class Release {
    public releaseGuid: string = '';
    public name: string = '';
    public description: string = '';
    @Transform(convertDate)
    public date: Date = new Date();
    public source: string = '';
    public type: string = '';
    public status: string = '';
    public releasePath: string ='';


    isNotInvalid = (): boolean => {
        return this.status !== '05';
    };
}
