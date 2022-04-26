import CodeRepository from "../../domain/repositories/codeRepository";
import {ApiGateway} from "../config/apiGateway";
import CodeList from "../../domain/entities/codeList";

export default class CodeApiRepository implements CodeRepository {
    constructor(private api: ApiGateway) { }

    getLocaleCodes = async (): Promise<CodeList> => {
        return this.api.get(`/codes/localeCodes`, { outType: CodeList});
    };
}