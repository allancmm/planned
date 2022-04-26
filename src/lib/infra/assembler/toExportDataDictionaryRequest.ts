import { ExportDataDictionaryRequest } from '../request/exportDataDictionaryRequest';

export const toExportDataDictionaryRequest = (exportType: string, fileName: string): ExportDataDictionaryRequest => ({
    exportType,
    fileName,
});
