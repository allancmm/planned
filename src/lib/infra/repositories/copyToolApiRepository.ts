import CopySequence from "../../domain/entities/copySequence";
import CopyToolRepository from "../../domain/repositories/copyToolRepository";
import { toDataCopyToolRequest } from "../assembler/toDataCopyToolRequest";
import { toExportDataCopyToolRequest } from "../assembler/toExportDataCopyToolRequest";
import { ApiGateway } from "../config/apiGateway";
import { DataCopyToolRequest } from "../request/dataCopyToolRequest";

export default class CopyToolApiRepository implements CopyToolRepository {
    constructor(private api: ApiGateway) { }
    export = async (sequenceName: string, sourceEnvironmentId: string, elementGUID: string, prefixPolicyNumber: string) => {
        await this.api.postBlobData(
            `/datacopy/export`, toExportDataCopyToolRequest(
                sequenceName,
                sourceEnvironmentId,
                elementGUID,
                prefixPolicyNumber,
            ),
        ).then(response => {
            const file = new Blob([response.data], { type: 'text/plain' });
            const downloadURL = window.URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = downloadURL;
            const filename = response.headers['content-disposition'].split('=')[1];
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
        });

    }

    import = async (file: Blob, destinationEnvironmentId: string): Promise<string> => {
        return this.api.post(
            `/datacopy/import?destinationEnvironmentId=${destinationEnvironmentId}`,
            file,
            undefined,
            'application/octet-stream'
        );
    };

    callDataCopyTool = async (sequenceName: string, sourceEnvironmentId: string, destinationEnvironmentId: string, elementGUID: string, numberOfCopies: number, prefixPolicyNumber: string): Promise<string> => {
        return this.api.put(
            `/datacopy`,
            toDataCopyToolRequest(
                sequenceName,
                sourceEnvironmentId,
                destinationEnvironmentId,
                elementGUID,
                numberOfCopies,
                prefixPolicyNumber,
            ),
            {
                inType: DataCopyToolRequest,
            },
        );
    }

    getCopySequences = async (): Promise<CopySequence[]> => {
        return this.api.getArray('/datacopy/sequenceNames', { outType: CopySequence });
    }

    getApi(): ApiGateway {
        return this.api;
    }
}
