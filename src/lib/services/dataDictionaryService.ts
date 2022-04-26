import DataDictionarySelectable from '../../lib/domain/entities/dataDictionarySelectable';
import DataModelList from '../domain/entities/dataModelList';
import LongJob from '../domain/util/longJob';
import { toExportDataDictionaryRequest } from '../infra/assembler/toExportDataDictionaryRequest';
import { ApiGateway } from '../infra/config/apiGateway';
import { ExportDataDictionaryRequest } from '../infra/request/exportDataDictionaryRequest';

export default class DataDictionaryService {
    constructor(private api: ApiGateway) {}

    generateDataDictionary = async (): Promise<LongJob> => {
        return this.api.post(`/data-dictionary/generate`, null, {
            outType: LongJob,
        });
    };

    export = async (fieldName: string, exportType: string): Promise<LongJob> => {
        return this.api.post(`/data-dictionary/export`, toExportDataDictionaryRequest(exportType, fieldName), {
            inType: ExportDataDictionaryRequest,
            outType: LongJob,
        });
    };

    getDataDictionaryAsExcel = async (completedJob: LongJob, fileName: string) => {
        const blobExcel = await this.api.getBlobData(
            `/data-dictionary/download?id=${completedJob.jobID}`,
            'application/json',
            'application/vnd.ms-excel',
        );
        const downloadURL = window.URL.createObjectURL(blobExcel);
        const link = document.createElement('a');
        link.href = downloadURL;
        link.setAttribute('download', `${fileName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    getProducts = async (companyGuid: string): Promise<DataDictionarySelectable[]> => {
        return this.api.getArray(`/data-dictionary/products/company/${companyGuid}`, {
            outType: DataDictionarySelectable,
        });
    };

    getPlans = async (entityGuid: string, type: string): Promise<DataDictionarySelectable[]> => {
        return this.api.getArray(`/data-dictionary/plans?entityGuid=${entityGuid}&type=${type}`, {
            outType: DataDictionarySelectable,
        });
    };

    getCategoriesByEntityAndGuid = async (entityGuid: string, type: string): Promise<DataDictionarySelectable[]> => {
        return this.api.getArray(`/data-dictionary/categories?entityGuid=${entityGuid}&type=${type}`, {
            outType: DataDictionarySelectable,
        });
    };

    getCategories = async (): Promise<DataDictionarySelectable[]> => {
        return this.api.getArray(`/data-dictionary/all`, { outType: DataDictionarySelectable });
    };

    findDataModelsByCategoryGuid = async (categoryGuid: string): Promise<DataModelList> => {
        return this.api.get(`/data-dictionary/category/${categoryGuid}`, { outType: DataModelList });
    };

    findDataModelsByFieldName = async (fieldName: string): Promise<DataModelList> => {
        return this.api.get(`/data-dictionary/dataModel/${fieldName}`, { outType: DataModelList });
    };

    getJobStatus = async (jobId: string): Promise<LongJob> => {
        return this.api.get(`jobs/${jobId}`, { outType: LongJob });
    };
}
