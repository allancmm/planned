import { AxiosApiGateway } from '../infra/config/axiosApiGateway';
import { JsonSerializer } from '../infra/config/jsonSerializer';
import AuthApiRepository from '../infra/repositories/authApiRepository';
import AutomatedTestApiRepository from '../infra/repositories/automatedTestApiRepository';
import BasicEntityApiRepository from '../infra/repositories/basicEntityApiRepository';
import CompanyApiRepository from '../infra/repositories/companyApiRepository';
import ConfigPackageApiRepository from '../infra/repositories/configPackageApiRepository';
import DebuggerEntitiesApiRepository from '../infra/repositories/debuggerEntitiesApiRepository';
import EntitiesApiRepository from '../infra/repositories/entitiesApiRepository';
import EntityInformationApiRepository from '../infra/repositories/entityInformationApiRepository';
import EnvironmentApiRepository from '../infra/repositories/environmentApiRepository';
import ExportMapApiRepository from '../infra/repositories/exportMapApiRepository';
import ExportSecurityGroupsApiRepository from '../infra/repositories/exportSecurityGroupsApiRepository';
import HistoryApiRepository from '../infra/repositories/historyApiRepository';
import ImportMapApiRepository from '../infra/repositories/importMapApiRepository';
import ImportRateApiRepository from '../infra/repositories/importRateApiRepository';
import ImportSecurityGroupsApiRepository from '../infra/repositories/importSecurityGroupsApiRepository';
import IntellisenseApiRepository from '../infra/repositories/intellisenseApiRepository';
import InterpreterApiRepository from '../infra/repositories/interpreterApiRepository';
import SqlQueryApiRepository from '../infra/repositories/sqlQueryApiRepository';
import UserApiRepository from '../infra/repositories/userApiRepository';
import JobApiRepository from '../infra/repositories/jobApiRepository';
import MigrationSetApiRepository from '../infra/repositories/migrationSetApiRepository';
import RateApiRepository from '../infra/repositories/rateApiRepository';
import ReleaseApiRepository from '../infra/repositories/releaseApiRepository';
import SearchRulesApiRepository from '../infra/repositories/searchRulesApiRepository';
import SecurityGroupApiRepository from '../infra/repositories/securityGroupApiRepository';
import SourceControlApiRepository from '../infra/repositories/sourceControlApiRepository';
import SqlScriptApiRepository from '../infra/repositories/sqlScriptApiRepository';
import StatsApiRepository from '../infra/repositories/statsApiRepository';
import TreeApiRepository from '../infra/repositories/treeApiRepository';
import UnitTestApiRepository from '../infra/repositories/unitTestApiRepository';
import OipaUserApiRepository from '../infra/repositories/oipaUserApiRepository';
import XmlTemplateApiRepository from '../infra/repositories/xmlTemplateApiRepository';
import AuthService from '../services/authService';
import AutomatedTestService from '../services/automatedTestService';
import BasicEntityService from '../services/basicEntityService';
import CompanyService from '../services/companyService';
import ConfigPackageService from '../services/configPackageService';
import DataCopyToolService from '../services/dataCopyToolService';
import DataDictionaryService from '../services/dataDictionaryService';
import DebuggerEntitiesService from '../services/debuggerEntitiesService';
import EntityService from '../services/entitiesService';
import EntityInformationService from '../services/entityInformationService';
import EnvironmentService from '../services/environmentService';
import ExportMapService from '../services/exportMapService';
import ExportSecurityGroupsService from '../services/exportSecurityGroupsService';
import GenerateXmlService from '../services/generateXmlService';
import GitService from '../services/gitService';
import HistoryService from '../services/historyService';
import ImportMapService from '../services/importMapService';
import ImportRateService from '../services/importRateService';
import ImportSecurityGroupsService from '../services/importSecurityGroupsService';
import InteropService from '../services/interopService';
import InterpreterService from '../services/interpreterService';
import SqlQueryService from '../services/sqlQueryService';
import UserService from '../services/userService';
import JobService from '../services/jobService';
import MigrationSetService from '../services/migrationSetService';
import RateService from '../services/rateService';
import ReleaseService from '../services/releaseService';
import SearchRulesService from '../services/searchRulesService';
import SecurityGroupService from '../services/securityGroupService';
import SourceControlService from '../services/sourceControlService';
import SqlScriptService from '../services/sqlScriptService';
import StatsService from '../services/statsService';
import TreeStructureService from '../services/treeStructureService';
import UnitTestService from '../services/unitTestService';
import OipaUserService from '../services/oipaUserService';
import XmlTemplateService from '../services/xmlTemplateService';
import TranslationService from "../services/translationService";
import TranslationApiRepository from "../infra/repositories/translationApiRepository";
import CodeService from "../services/codeService";
import CodeApiRepository from "../infra/repositories/codeApiRepository";
import CopyToolApiRepository from '../infra/repositories/copyToolApiRepository';
import MigrationPathService from "../services/migrationPathService";
import MigrationPathApiRepository from "../infra/repositories/migrationPathApiRepository";
import ReportService from '../services/reportService';
import ReportApiRepository from '../infra/repositories/reportApiRepository';
import ReleaseReportHistoryApiRepository from '../infra/repositories/releaseReportHistoryApiRepository';
import ReleaseReportHistoryService from '../services/releaseReportHistoryService';
import EntityDuplicateService from "../services/entityDuplicateService";
import EntityDuplicateApiRepository from "../infra/repositories/EntityDuplicateApiRepository";
import SystemFileApiRepository from "../infra/repositories/systemFileApiRepository";
import SystemFileService from "../services/systemFileService";

export const defaultInteropService = new InteropService();
defaultInteropService.tryGrabOldStudioUrl();

const objectMapper = new JsonSerializer();
const defaultApiGateway = new AxiosApiGateway(defaultInteropService, objectMapper);

export const defaultAuthService = new AuthService(new AuthApiRepository(defaultApiGateway));
export const defaultReleaseReportHistoryService = new ReleaseReportHistoryService(new ReleaseReportHistoryApiRepository(defaultApiGateway));

export const defaultOipaUserService = new OipaUserService(new OipaUserApiRepository(defaultApiGateway));
export const defaultCompanyService = new CompanyService(new CompanyApiRepository(defaultApiGateway));
export const defaultSecurityGroupService = new SecurityGroupService(new SecurityGroupApiRepository(defaultApiGateway));
export const defaultSourceControlService = new SourceControlService(new SourceControlApiRepository(defaultApiGateway));
export const defaultEnvironmentService = new EnvironmentService(new EnvironmentApiRepository(defaultApiGateway));
export const defaultUserService = new UserService(new UserApiRepository(defaultApiGateway));
export const defaultGitService = new GitService(defaultApiGateway);
export const defaultReleaseService = new ReleaseService(new ReleaseApiRepository(defaultApiGateway));
export const defaultConfigPackageService = new ConfigPackageService(new ConfigPackageApiRepository(defaultApiGateway));
export const defaultMigrationSetService = new MigrationSetService(new MigrationSetApiRepository(defaultApiGateway));
export const defaultEntityInformationService = new EntityInformationService(
    new EntityInformationApiRepository(defaultApiGateway),
);

export const defaultReportsService = new ReportService(new ReportApiRepository(defaultApiGateway));

export const defaultSearchRulesService = new SearchRulesService(
    new SearchRulesApiRepository(defaultApiGateway),
    new CompanyApiRepository(defaultApiGateway),
);
export const defaultDebuggerEntitiesService = new DebuggerEntitiesService(
    new DebuggerEntitiesApiRepository(defaultApiGateway),
);

export const defaultInterpreterService = new InterpreterService(new InterpreterApiRepository(defaultApiGateway));
export const defaultUnitTestService = new UnitTestService(new UnitTestApiRepository(defaultApiGateway));

export const defaultIntellisenseRepository = new IntellisenseApiRepository(defaultApiGateway);

export const defaultGenerateXmlService = new GenerateXmlService(defaultApiGateway);

export const defaultHistoryService = new HistoryService(new HistoryApiRepository(defaultApiGateway));

export const defaultDataDictionaryService = new DataDictionaryService(defaultApiGateway);
export const defaultDataCopyToolService = new DataCopyToolService(new CopyToolApiRepository(defaultApiGateway));
export const defaultXmlTemplateService = new XmlTemplateService(new XmlTemplateApiRepository(defaultApiGateway));
export const defaultEntitiesService = new EntityService(new EntitiesApiRepository(defaultApiGateway));

export const defaultStatsService = new StatsService(new StatsApiRepository(defaultApiGateway));

export const defaultImportSecurityGroupsService = new ImportSecurityGroupsService(
    new ImportSecurityGroupsApiRepository(defaultApiGateway),
);
export const defaultExportSecurityGroupsService = new ExportSecurityGroupsService(
    new ExportSecurityGroupsApiRepository(defaultApiGateway),
);
export const defaultJobService = new JobService(new JobApiRepository(defaultApiGateway));
export const defaultImportMapService = new ImportMapService(new ImportMapApiRepository(defaultApiGateway));
export const defaultExportMapService = new ExportMapService(new ExportMapApiRepository(defaultApiGateway));
export const defaultImportRateService = new ImportRateService(new ImportRateApiRepository(defaultApiGateway));

export const defaultTreeStructureService = new TreeStructureService(new TreeApiRepository(defaultApiGateway));

export const defaultBasicEntityService = new BasicEntityService(new BasicEntityApiRepository(defaultApiGateway));
export const defaultScriptSqlService = new SqlScriptService(new SqlScriptApiRepository(defaultApiGateway));
export const defaultRateService = new RateService(new RateApiRepository(defaultApiGateway));

export const defaultTranslationService = new TranslationService(new TranslationApiRepository(defaultApiGateway));

export const defaultCodeService = new CodeService(new CodeApiRepository(defaultApiGateway));

export const defaultMigrationPathService = new MigrationPathService(new MigrationPathApiRepository(defaultApiGateway));

export const defaultSqlQueryService = new SqlQueryService(new SqlQueryApiRepository(defaultApiGateway));

export const defaultEntityDuplicateService = new EntityDuplicateService(new EntityDuplicateApiRepository(defaultApiGateway));

export const defaultSystemFileService = new SystemFileService(new SystemFileApiRepository(defaultApiGateway));

export const defaultAutomatedTestService = new AutomatedTestService(new AutomatedTestApiRepository(defaultApiGateway));