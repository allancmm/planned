import { Transform } from 'class-transformer';
import { convertDate } from '../../util/transform';

export default class ReviewComment {
    public commentGuid: string = '';
    public userName: string = '';
    public content: string = '';
    @Transform(convertDate)
    public date: Date = new Date();
    public ruleGuid: string = '';
    public ruleName: string = '';
    public configPackageGuid: string = '';
}
