import { Transform } from "class-transformer";
import { immerable } from "immer";
import { convertDate } from "../../util/transform";

export default class ActivityTimeEntity {
    [immerable] = true;
    public environmentName?: string;
    @Transform(convertDate) public start?: Date;
    @Transform(convertDate) public end?: Date;
    public activeTime?: Number;

    constructor(environmentName?:string, start?: Date, end?: Date, activeTime?: Number) {
        this.environmentName = environmentName;
        this.start = start;
        this.end = end;
        this.activeTime = activeTime;
    }
}
