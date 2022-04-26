import { Expose, Transform, Type } from 'class-transformer';
import { format } from 'date-fns';
import { immerable } from 'immer';
import { convertDate } from '../../util/transform';
import OipaRule from './oipaRule';

export default class Version {
    [immerable] = true;

    public versionGuid: string = '';
    public versionNumber: number = 0;
    public lastModifiedBy: string = '';
    @Transform(convertDate)
    public lastModifiedAt: Date = new Date();
    public comments: string = '';
    public label: string = '';
    public ignoreable: boolean = false;

    public versionFieldsNames: string[] = [];

    @Type(() => OipaRule) public rule: OipaRule = new OipaRule();

    @Expose({ groups: ['cache'] })
    public fromPackageName: string = '';

    getFormattedName = () => {
        return `${this.rule.ruleName} - ${this.getFormattedMetadata()}`;
    };

    getFormattedMetadata = () => {
        return `${this.versionNumber} - ${format(this.lastModifiedAt, 'MMM/dd/yyyy (hh:mm.aaa)')} - ${
            this.lastModifiedBy
        }`;
    };
}
