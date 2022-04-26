import DebuggerEntityList from '../../domain/entities/debuggerEntityList';
import DebuggerParameters from '../../domain/entities/debuggerParameters';
import DebuggerParametersRequest from '../../domain/entities/debuggerParametersRequest';
import GuidEntityTypePair from '../../domain/entities/guidEntityTypePair';
import BasicEntity from '../../domain/entities/basicEntity';
import { EntityLevel } from '../../domain/enums/entityLevel';
import { EntityType } from '../../domain/enums/entityType';
import DebuggerEntitiesRepository from '../../domain/repositories/debuggerEntitiesRepository';
import Pageable from '../../domain/util/pageable';
import * as DebuggerParametersAssembler from '../assembler/debuggerParameterAssembler';
import { ApiGateway } from '../config/apiGateway';
import ParameterItem from '../../domain/entities/parameterItem';
import ParameterTable from '../../domain/entities/parameterTable';
import MultifieldItem from '../../domain/entities/multifieldItem';
import ParameterParserRequest from '../../domain/entities/parameterParserRequest';

export default class DebuggerEntitiesApiRepository implements DebuggerEntitiesRepository {
    constructor(private api: ApiGateway) {}

    getRules = async (entityType: EntityType, entityLevel: EntityLevel, entity: string): Promise<BasicEntity[]> => {
        return this.api.getArray(
            `/debugger/rules?entityType=${entityType}&entityLevel=${entityLevel}&entityGuid=${entity}`,
            { outType: BasicEntity },
        );
    };

    getEntitiesForLevel = async (
        entityLevel: EntityLevel,
        page: Pageable,
        searchTerm?: string,
        applicationPlan?: boolean,
    ): Promise<DebuggerEntityList> => {
        return this.api.get(
            `/debugger/entities?entityLevel=${entityLevel}&pageNumber=${page.pageNumber}&size=${page.size}${
                searchTerm ? `&searchTerm=${searchTerm}` : ''
            }${applicationPlan ? `&applicationPlan=${applicationPlan}` : ''}`,
            { outType: DebuggerEntityList },
        );
    };

    getParameters = async (
        type: EntityType,
        level: EntityLevel,
        entityGuid: string,
        ruleGuid: string,
    ): Promise<DebuggerParameters> => {
        return this.api.post(
            '/debugger/parameters',
            DebuggerParametersAssembler.toDebuggerRequest(type, level, entityGuid, ruleGuid),
            {
                inType: DebuggerParametersRequest,
                outType: DebuggerParameters,
            },
        );
    };

    getParametersXmlFromTable = async (
        type: EntityType,
        parametersTable: ParameterItem[],
        indexes: MultifieldItem[],
    ): Promise<string> => {
        return this.api.post(
            `/debugger/parametersToXml?entityType=${type}`,
            { parametersTable, indexes },
            {inType: ParameterTable},   
        );
    };

    getParametersTableFromXML = async (
        xmlContent: string,
        type: EntityType,
    ): Promise<DebuggerParameters> => {
        return this.api.post(
            `/debugger/parametersToTable?entityType=${type}`,
            { xmlContent },
            { inType: ParameterParserRequest, outType: DebuggerParameters},
        );
    };

    getInterpreterEditorInformation = async (guid: string, entityType: EntityType): Promise<GuidEntityTypePair> => {
        return this.api.post(
            '/debugger/editorInformation',
            { guid, entityType },
            { inType: GuidEntityTypePair, outType: GuidEntityTypePair },
        );
    };
}
