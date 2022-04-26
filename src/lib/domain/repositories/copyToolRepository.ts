import { ApiGateway } from "../../infra/config/apiGateway";
import CopySequence from "../entities/copySequence";

export default interface CopyToolRepository {
    getCopySequences(): Promise<CopySequence[]>;

    getApi(): ApiGateway;

    callDataCopyTool(
        sequenceName: string,
        sourceEnvironmentId: string,
        destinationEnvironmentId: string,
        elementGUID: string,
        numberOfCopies: number,
        prefixPolicyNumber: string,
    ): Promise<string>;

    export(
        sequenceName: string,
        sourceEnvironmentId: string,
        elementGUID: string,
        prefixPolicyNumber: string,
    ): any

    import(
        file: Blob,
        destinationEnvironmentId: string
    ): Promise<string>;
}
