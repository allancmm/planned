import Code from "./code";
import { Type } from 'class-transformer';

export default class CodeList {
    @Type(() => Code)
    public codes: Code[] = [];

    static empty = () : CodeList => {
        return new CodeList();
    }
}