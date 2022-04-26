import DebuggerEntityList from '../domain/entities/debuggerEntityList';
import DebuggerParameters from '../domain/entities/debuggerParameters';
import GuidEntityTypePair from '../domain/entities/guidEntityTypePair';
import BasicEntity from '../domain/entities/basicEntity';
import { EntityLevel } from '../domain/enums/entityLevel';
import { EntityType } from '../domain/enums/entityType';
import DebuggerEntitiesRepository from '../domain/repositories/debuggerEntitiesRepository';
import Pageable from '../domain/util/pageable';
import ParameterItem from '../domain/entities/parameterItem';
import MultifieldItem from '../domain/entities/multifieldItem';

export default class DebuggerEntitiesService {
    constructor(private debuggerEntitiesRepository: DebuggerEntitiesRepository) {}

    getRules = async (entityType: EntityType, entityLevel: EntityLevel, entity: string): Promise<BasicEntity[]> => {
        if (entityType === '' || (entityLevel !== 'NONE' && entity === '')) {
            return Promise.resolve([]);
        }
        return this.debuggerEntitiesRepository.getRules(entityType, entityLevel, entity);
    };

    getEntitiesForLevel = async (
        entityLevel: EntityLevel,
        page: Pageable,
        searchTerm?: string,
        applicationPlan: boolean = false,
    ): Promise<DebuggerEntityList> => {
        if (entityLevel === 'NONE') return Promise.resolve(new DebuggerEntityList());
        return this.debuggerEntitiesRepository.getEntitiesForLevel(entityLevel, page, searchTerm, applicationPlan);
    };

    getParameters = async (
        type: EntityType,
        level: EntityLevel,
        entityGuid: string,
        ruleGuid: string,
    ): Promise<DebuggerParameters> => {
        if (type === '' || (level !== 'NONE' && entityGuid === '') || ruleGuid === '') {
            return Promise.resolve(new DebuggerParameters());
        }
        return this.debuggerEntitiesRepository.getParameters(type, level, entityGuid, ruleGuid);
    };

    getParametersXmlFromTable = async (
        type: EntityType,
        parametersTable: ParameterItem[],
        indexes: MultifieldItem[],
    ): Promise<string> => {
        if (type === '') {
            return Promise.resolve('');
        }
        return this.debuggerEntitiesRepository.getParametersXmlFromTable(type, parametersTable, indexes);
    };

    getParametersTableFromXML = async (
        xmlContent: string,
        type: EntityType,
    ): Promise<DebuggerParameters> => {
        if (type === '') {
            return Promise.resolve(new DebuggerParameters());
        }
        return this.debuggerEntitiesRepository.getParametersTableFromXML(xmlContent, type);
    };

    getInterpreterEditorInformation = async (guid: string, entityType: EntityType): Promise<GuidEntityTypePair> => {
        return this.debuggerEntitiesRepository.getInterpreterEditorInformation(guid, entityType);
    };
}
