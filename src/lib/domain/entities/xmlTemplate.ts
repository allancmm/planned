import { immerable } from "immer";

export default class XmlTemplate {
    [immerable] = true;

    public name: string = '';
    public basePath: string = '';
    public extension: string = '';
}
