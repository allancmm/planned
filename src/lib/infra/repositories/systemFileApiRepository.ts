import SystemFileRepository from "../../domain/repositories/systemFileRepository";
import { ApiGateway } from "../config/apiGateway";
import SystemFileType from "../../domain/enums/systemFileType";

export default class SystemFileApiRepository implements SystemFileRepository {
    constructor(private api: ApiGateway) {}

    getSystemFile = (codeSystemFile: SystemFileType) : Promise<string> =>
         this.api.get(`/systemFile/codes?fileName=${codeSystemFile}`);

    updateSystemFile = (codeSystemFile: SystemFileType, dataSystemFile: string): Promise<void> =>
        this.api.post(`/systemFile/update?fileName=${codeSystemFile}`, dataSystemFile );
}