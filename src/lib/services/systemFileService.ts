import SystemFileRepository from "../domain/repositories/systemFileRepository";
import SystemFileType from "../domain/enums/systemFileType";

export default class SystemFileService {
    constructor(private systemFileRepository: SystemFileRepository) {}

    getSystemFile = async (codeSystemFile: SystemFileType) : Promise<string> =>
        this.systemFileRepository.getSystemFile(codeSystemFile);

    updateSystemFile = async (codeSystemFile: SystemFileType, dataSystemFile: string): Promise<void> =>
        this.systemFileRepository.updateSystemFile(codeSystemFile, dataSystemFile);
}