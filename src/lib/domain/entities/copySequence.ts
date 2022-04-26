import { immerable } from "immer";

export default class CopySequence {
    [immerable] = true;
    public name: string = '';
    public parameters: string[] = [];
}
