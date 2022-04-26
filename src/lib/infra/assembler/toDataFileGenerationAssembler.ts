import { EntityLevel } from '../../domain/enums/entityLevel';
import { DataFileGenerationRequest } from '../request/dataFileGenerationRequest';
import {DataFileSaveRequest} from '../request/dataFileSaveRequest';

export const toDataFileGenerationRequest = (
    dataFileName: string,
    entityLevel: EntityLevel,
    genericXMLOption: string,
    entityGuid: string,
    systemCode: string,
    stateCode: string,
): DataFileGenerationRequest => ({ dataFileName, entityLevel, genericXMLOption, entityGuid, systemCode, stateCode });

export const toDataFileSaveRequest = (
    dataFileGuid: string,
    dataFileName: string,
    entityLevel: EntityLevel,
    xml: string,
    create: boolean
): DataFileSaveRequest => ({ dataFileGuid, dataFileName, entityLevel, xml, create });
