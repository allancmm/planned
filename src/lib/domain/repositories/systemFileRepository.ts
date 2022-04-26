import SystemFileType from "../enums/systemFileType";

export default interface SystemFileRepository {
    getSystemFile(codeSystemFile: SystemFileType): Promise<string>;
    updateSystemFile(codeSystemFile: SystemFileType, dataSystemFile: string): Promise<void>;
}