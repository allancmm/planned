import BasicEntity from '../domain/entities/basicEntity';
import DataFile from '../domain/entities/dataFile';
import { CodeType } from '../domain/enums/codeType';
import { EntityLevel } from '../domain/enums/entityLevel';
import {toDataFileGenerationRequest, toDataFileSaveRequest} from '../infra/assembler/toDataFileGenerationAssembler';
import { ApiGateway } from '../infra/config/apiGateway';
import { DataFileGenerationRequest } from '../infra/request/dataFileGenerationRequest';
import {DataFileSaveRequest} from '../infra/request/dataFileSaveRequest';

export default class GenerateXmlService {
    constructor(private api: ApiGateway) {}

    generateXmlFile = async (
        dataFileName: string,
        entityLevel: EntityLevel,
        genericXMLOption: string,
        entityGuid: string,
        systemCode: string,
        stateCode: string,
    ): Promise<DataFile> => {
        return this.api.post(
            `/data-file`,
            toDataFileGenerationRequest(dataFileName, entityLevel, genericXMLOption, entityGuid, systemCode, stateCode),
            {
                inType: DataFileGenerationRequest,
                outType: DataFile,
            },
        );
    };

    saveDataFile = async (dataFileGuid: string, dataFileName: string, entityLevel: EntityLevel, xml: string, create: boolean) => {
        return this.api.post(`/data-file/save`,
            toDataFileSaveRequest(dataFileGuid, dataFileName, entityLevel, xml, create),
            {
                inType: DataFileSaveRequest
            },
        );
    };

    getCodes = async (codeType: CodeType): Promise<BasicEntity[]> => {
        return this.api.getArray(`/data-file/codes?codeType=${codeType}`, { outType: BasicEntity });
    };
}
