import CodeList from "../entities/codeList";

export default interface CodeRepository {
    getLocaleCodes() : Promise<CodeList>;
}