import { immerable } from "immer";

export default class ResultSqlScript {
    [immerable] = true;
    public result: string[] = [];
    public runBy: string = '';
	public runDate: Date = new Date();
}
