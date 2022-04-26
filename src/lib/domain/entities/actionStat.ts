import { immerable } from "immer";
import { v4 as uuid } from "uuid";
import { Type } from 'class-transformer';
export default class ActionStat {
    [immerable] = true;
    public guid: string = uuid();
    public type?: string;
    public count?: number;
    @Type(() => ActionStat) public children?: ActionStat[];

    constructor(type?: string, count?: number, children?: ActionStat[]) {
        this.type = type;
        this.count = count;
        this.children = children;
    }
}
