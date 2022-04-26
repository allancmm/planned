import CodeList from "../domain/entities/codeList";
import CodeRepository from "../domain/repositories/codeRepository";

export default class CodeService {
    constructor(private codeRepository: CodeRepository) {}

    getLocaleCodes = async () : Promise<CodeList> => {
        return this.codeRepository.getLocaleCodes();
    }
}