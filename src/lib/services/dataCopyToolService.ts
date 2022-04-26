import CopySequence from "../domain/entities/copySequence";
import CopyToolRepository from "../domain/repositories/copyToolRepository";
import { ApiGateway } from "../infra/config/apiGateway";

export default class DataCopyToolService {
    constructor(private copyToolRepository: CopyToolRepository) { }

    callDataCopyTool = async (
        sequenceName: string,
        sourceEnvironmentId: string,
        destinationEnvironmentId: string,
        elementGUID: string,
        numberOfCopies: number,
        prefixPolicyNumber: string,
    ): Promise<string> => {
        return this.copyToolRepository.callDataCopyTool(sequenceName,
            sourceEnvironmentId,
            destinationEnvironmentId,
            elementGUID,
            numberOfCopies,
            prefixPolicyNumber);
    };

    getCopySequences = async (): Promise<CopySequence[]> => {
        return this.copyToolRepository.getCopySequences();
    };
    getApi(): ApiGateway {
        return this.copyToolRepository.getApi();
    };

    export = async (
        sequenceName: string,
        sourceEnvironmentId: string,
        elementGUID: string,
        prefixPolicyNumber: string,
    ) => {
        return this.copyToolRepository.export(sequenceName,
            sourceEnvironmentId,
            elementGUID,
            prefixPolicyNumber);
    };

    import = async (
        file: Blob,
        destinationEnvironmentId: string
    ): Promise<string> => {
        return this.copyToolRepository.import(
            file,
            destinationEnvironmentId,
        );
    };
}