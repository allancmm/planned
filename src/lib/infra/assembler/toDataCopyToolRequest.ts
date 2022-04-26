import { DataCopyToolRequest } from '../request/dataCopyToolRequest';

export const toDataCopyToolRequest = (
    sequenceName: string,
    sourceEnvironmentId: string,
    destinationEnvironmentId: string,
    elementGUID: string,
    numberOfCopies: number,
    prefixPolicyNumber: string,
): DataCopyToolRequest => ({
    sequenceName,
    sourceEnvironmentId,
    destinationEnvironmentId,
    elementGUID,
    numberOfCopies,
    prefixPolicyNumber,
});
