import { ExportDataCopyToolRequest } from "../request/exportDataCopyToolRequest";

export const toExportDataCopyToolRequest = (
    sequenceName: string,
    sourceEnvironmentId: string,
    elementGUID: string,
    prefixPolicyNumber: string,
): ExportDataCopyToolRequest => ({
    sequenceName,
    sourceEnvironmentId,
    elementGUID,
    prefixPolicyNumber,
});
