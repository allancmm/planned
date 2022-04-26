import DebuggerEntityList from '../entities/debuggerEntityList';
import DebuggerParameters from '../entities/debuggerParameters';
import GuidEntityTypePair from '../entities/guidEntityTypePair';
import BasicEntity from '../entities/basicEntity';
import { EntityLevel } from '../enums/entityLevel';
import { EntityType } from '../enums/entityType';
import Pageable from '../util/pageable';
import ParameterItem from '../entities/parameterItem';
import MultifieldItem from '../entities/multifieldItem';

export default interface DebuggerEntitiesRepository {
    getRules(entityType: EntityType, entityLevel: EntityLevel, entity: string): Promise<BasicEntity[]>;

    getEntitiesForLevel(
        entityLevel: EntityLevel,
        page: Pageable,
        searchTerm?: string,
        applicationPlan?: boolean,
    ): Promise<DebuggerEntityList>;

    getParameters(
        type: EntityType,
        level: EntityLevel,
        entityGuid: string,
        ruleGuid: string,
    ): Promise<DebuggerParameters>;

    getParametersXmlFromTable(
        type: EntityType,
        parametersTable: ParameterItem[],
        indexes: MultifieldItem[],
    ): Promise<string>;

    getParametersTableFromXML (
        xmlContent: string,
        type: EntityType,
    ): Promise<DebuggerParameters>;

    getInterpreterEditorInformation(guid: string, entityType: EntityType): Promise<GuidEntityTypePair>;
}
