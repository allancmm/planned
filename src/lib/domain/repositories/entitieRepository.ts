import BasicEntity from '../entities/basicEntity';
import Code from '../entities/code';
import Country from '../entities/country';
import CreateActivityFilterRequest from '../entities/createActivityFilterRequest';
import CreateAgreementDefinitionRequest from '../entities/createAgreementDefinitionRequest';
import CreateAsFileRequest from '../entities/createAsFileRequest';
import CreateBatchScreenRequest from '../entities/createBatchScreenRequest';
import CreateBusinessRuleRequest from '../entities/createBusinessRuleRequest';
import CreateChartAccountEntityRequest from '../entities/createChartAccountEntityRequest';
import CreateChartAccountEntryRequest from '../entities/createChartAccountEntryRequest';
import CreateChartAccountRequest from '../entities/createChartAccountRequest';
import CreateCommentsTemplateRequest from '../entities/createCommentsTemplateRequest';
import CreateCompanyRequest from '../entities/createCompanyRequest';
import CreateExposedComputationRequest from '../entities/createExposedComputationRequest';
import CreateFileOutputRequest from '../entities/createFileOutputRequest';
import CreateFundRequest from '../entities/createFundRequest';
import CreateInquiryScreenRequest from '../entities/createInquiryScreenRequest';
import CreateIntakeProfileDefinitionRequest from '../entities/createIntakeProfileDefinitionRequest';
import CreateMapRequest from '../entities/CreateMapRequest';
import CreateMaskDetailRequest from '../entities/createMaskDetailRequest';
import CreatePlanFundRequest from '../entities/createPlanFundRequest';
import CreatePlanProgramRequest from '../entities/CreatePlanProgramRequest';
import CreatePlanRequest from '../entities/createPlanRequest';
import CreateProductRequest from '../entities/createProductRequest';
import CreateProgramRequest from '../entities/createProgramRequest';
import CreateQuoteDefinitionRequest from '../entities/createQuoteDefinitionRequest';
import CreateRelatedFundRequest from '../entities/CreateRelatedFundRequest';
import CreateRequirementDefinitionRequest, {
    CategoryCode,
    LevelCode,
    SeverityCode,
    StateCode,
} from '../entities/createRequirementDefinitionRequest';
import CreateRequirementGroupRequest from '../entities/createRequirementGroupRequest';
import CreateSecurityGroupRequest from '../entities/CreateSecurityGroupRequest';
import CreateSegmentNameRequest from '../entities/createSegmentNameRequest';
import CreateSegmentProgramRequest from '../entities/CreateSegmentProgramRequest';
import CreateSqlScriptRequest from '../entities/createSqlScriptRequest';
import CreateSystemDateRequest from '../entities/createSystemDateRequest';
import CreateTransactionRuleRequest, { AttachedRuleDto, TransactionMapDto } from '../entities/createTransactionRequest';
import CreateWorkflowTaskDefinitionRequest from '../entities/createWorkflowTaskDefinitionRequest';
import Currency from '../entities/currency';
import EntityAttachedRulesRequest from '../entities/entityAttachedRulesRequest';
import MapKeyValue from '../entities/mapKeyValue';
import Plan from '../entities/plan';
import Product from '../entities/product';
import ProgramDefinition from '../entities/programDefinition';
import SegmentName from '../entities/segmentName';
import SystemDate from '../entities/systemDate';
import SystemDateFiltersContainer from '../entities/systemDateFiltersContainer';
import EntityInformation from '../entities/tabData/entityInformation';
import TransactionEligibilityStatus from '../entities/transactionEligibilityStatus';
import TransactionType from '../entities/transactionTypes';
import { EntityLevel } from '../enums/entityLevel';
import { EntityType } from '../enums/entityType';

export default interface EntitiesRepository {
    getBusinessRulesNames(typeCode: string): Promise<string[]>;

    getAvailableBusinessRuleOverrides(typeCode: string, name: string): Promise<any[]>;

    getAvailableProducts(companyGuid: string): Promise<Product[]>;

    getCurrencyCodes(): Promise<Currency[]>;

    getCurrencies(): Promise<Currency[]>;

    getAvailablePlans(productGuid: string): Promise<Plan[]>;

    getAvailableChildPlans(productGuid: string): Promise<Plan[]>;

    getAllPlans(): Promise<Plan[]>;

    getAllSegmentNames(): Promise<SegmentName[]>;

    getAllProgramDefinition(): Promise<ProgramDefinition[]>;

    getCompanyPlans(companyGuid: string): Promise<Plan[]>;

    getCompanyProducts(companyGuid: string): Promise<MapKeyValue[]>;

    getTransactionTypes(level: EntityLevel): Promise<TransactionType[]>;

    getLevelAttachedRules(level: EntityLevel, searchQuery?: string): Promise<AttachedRuleDto[]>;

    getEntityAttachedRules(guid: string, type: EntityType): Promise<string[]>;

    getEntityLevel(guid: string, type: EntityType): Promise<EntityLevel>;

    getSecurityGroups(companyGuid: string): Promise<BasicEntity[]>;

    getTransactionEligibilityStatuses(): Promise<TransactionEligibilityStatus[]>;

    getTransactionTranslations(name: string): Promise<TransactionMapDto[]>;

    createBusinessRule(businessRuleRequest: CreateBusinessRuleRequest): Promise<EntityInformation>;

    createAsFile(asFileRequest: CreateAsFileRequest): Promise<EntityInformation>;

    createFileOutput(fileOutputRequest: CreateFileOutputRequest): Promise<EntityInformation>;

    createBatchScreen(createBatchScreenRequest: CreateBatchScreenRequest): Promise<EntityInformation>;

    createChartAccount(createChartAccountRequest: CreateChartAccountRequest): Promise<EntityInformation>;

    createChartAccountEntity(createChartAccountEntityRequest: CreateChartAccountEntityRequest): Promise<EntityInformation>;

    createChartAccountEntry(createChartAccountEntryRequest: CreateChartAccountEntryRequest): Promise<EntityInformation>;

    createCommentsTemplate(createCommentsTemplateRequest: CreateCommentsTemplateRequest): Promise<EntityInformation>;

    inquiryExist(inquiryRequest: CreateInquiryScreenRequest): Promise<boolean>;

    planProgramExist(planProgramRequest: CreatePlanProgramRequest): Promise<boolean>;

    segmentProgramExist(request: CreateSegmentProgramRequest): Promise<boolean>;

    createProduct(productRequest: CreateProductRequest): Promise<EntityInformation>;

    createCompany(companyRequest: CreateCompanyRequest): Promise<EntityInformation>;

    createTransaction(transactionRequest: CreateTransactionRuleRequest): Promise<EntityInformation[]>;

    createActivityFilter(createActivityFilter: CreateActivityFilterRequest): Promise<EntityInformation>;

    createRequirement(requirementRequest: CreateRequirementDefinitionRequest): Promise<EntityInformation[]>;

    createRequirementGroup(requirementGroupRequest: CreateRequirementGroupRequest): Promise<EntityInformation>;

    createInquiry(inquiryScreen: CreateInquiryScreenRequest): Promise<EntityInformation>;

    createPlanProgramDefinition(planProgramRequest: CreatePlanProgramRequest): Promise<EntityInformation>;

    createSegmentProgramDefinition(request: CreateSegmentProgramRequest): Promise<EntityInformation>;

    createIntakeProfileDefinition(
        intakeProfileDefinition: CreateIntakeProfileDefinitionRequest,
    ): Promise<EntityInformation>;

    createSegment(segmentRequest: CreateSegmentNameRequest): Promise<EntityInformation>;

    createMapGroup(mapGroupRquest: CreateMapRequest): Promise<EntityInformation>;

    createPlan(planRequest: CreatePlanRequest): Promise<EntityInformation>;

    createQuote(quoteRequest: CreateQuoteDefinitionRequest): Promise<EntityInformation>;

    createProgram(programRequest: CreateProgramRequest): Promise<EntityInformation>;

    createAgreement(agreementRequest: CreateAgreementDefinitionRequest): Promise<EntityInformation>;

    getBusinessRules(typeCode: string): Promise<string[]>;

    createExposedComputation(
        createExposedComputationRequest: CreateExposedComputationRequest,
    ): Promise<EntityInformation>;

    createSqlScript(sqlscriptRequest: CreateSqlScriptRequest): Promise<EntityInformation>;

    getStateCodes(): Promise<StateCode[]>;

    getSCompanies(): Promise<MapKeyValue[]>;

    getInquiryScreenTypes(): Promise<MapKeyValue[]>;

    getIntakeProfileDefinitionTypes(): Promise<MapKeyValue[]>;

    getSegmentNameTypes(): Promise<MapKeyValue[]>;

    getQuoteCodes(codeName: string): Promise<MapKeyValue[]>;

    getSeverityCodes(): Promise<SeverityCode[]>;

    getMarketMaker(): Promise<BasicEntity[]>;

    getCodes(type: string, useLongDescription?: boolean): Promise<BasicEntity[]>;

    getChartAccounts(): Promise<BasicEntity[]>;

    getChartAccountEntities(guid: string): Promise<BasicEntity[]>;

    getLevelCodes(): Promise<LevelCode[]>;

    getCategoryCode(): Promise<CategoryCode[]>;

    getCountryCodes(): Promise<Country[]>;

    createMaskDetail(maskDetailRequest: CreateMaskDetailRequest): Promise<EntityInformation>;

    createSecurityGroup(securityGroupRequest: CreateSecurityGroupRequest): Promise<EntityInformation>;

    createWorkflowTaskDefinition(
        workflowTaskDefinitionRequest: CreateWorkflowTaskDefinitionRequest,
    ): Promise<EntityInformation>;

    updateEntityAttachedRules(entityAttachedRulesRequest: EntityAttachedRulesRequest): Promise<EntityInformation[]>;

    createFund(fund: CreateFundRequest): Promise<EntityInformation>;

    createPlanFund(planFund: CreatePlanFundRequest): Promise<EntityInformation>;

    createRelatedFund(relatedFund: CreateRelatedFundRequest): Promise<EntityInformation>;

    canDelete(entityType: EntityType, guid: string): Promise<boolean>;

    delete(entityType: EntityType, guid: string): Promise<void>;

    getAsFileId(guid: string): Promise<string>;

    getSystemDates(month: string, year: string, calendarCode: string): Promise<SystemDate[]>;

    getSystemDateFilters(): Promise<SystemDateFiltersContainer>;

    createSystemDate(request: CreateSystemDateRequest): Promise<void>;

    getTransactionTypeCode(guid: string): Promise<TransactionType>;

    getCalendarCodes(): Promise<Code[]>;
}
