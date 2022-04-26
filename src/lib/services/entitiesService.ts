import BasicEntity from '../domain/entities/basicEntity';
import Code from '../domain/entities/code';
import Country from '../domain/entities/country';
import CreateActivityFilterRequest from '../domain/entities/createActivityFilterRequest';
import CreateAgreementDefinitionRequest from '../domain/entities/createAgreementDefinitionRequest';
import CreateAsFileRequest from '../domain/entities/createAsFileRequest';
import CreateBatchScreenRequest from '../domain/entities/createBatchScreenRequest';
import CreateBusinessRuleRequest from '../domain/entities/createBusinessRuleRequest';
import CreateChartAccountEntityRequest from '../domain/entities/createChartAccountEntityRequest';
import CreateChartAccountEntryRequest from '../domain/entities/createChartAccountEntryRequest';
import CreateChartAccountRequest from '../domain/entities/createChartAccountRequest';
import CreateCommentsTemplateRequest from '../domain/entities/createCommentsTemplateRequest';
import CreateCompanyRequest from '../domain/entities/createCompanyRequest';
import CreateExposedComputationRequest from '../domain/entities/createExposedComputationRequest';
import CreateFileOutputRequest from '../domain/entities/createFileOutputRequest';
import CreateFundRequest from '../domain/entities/createFundRequest';
import CreateInquiryScreenRequest from '../domain/entities/createInquiryScreenRequest';
import CreateIntakeProfileDefinitionRequest from '../domain/entities/createIntakeProfileDefinitionRequest';
import CreateMapRequest from '../domain/entities/CreateMapRequest';
import CreateMaskDetailRequest from '../domain/entities/createMaskDetailRequest';
import CreatePlanFundRequest from '../domain/entities/createPlanFundRequest';
import CreatePlanProgramRequest from '../domain/entities/CreatePlanProgramRequest';
import CreatePlanRequest from '../domain/entities/createPlanRequest';
import CreateProductRequest from '../domain/entities/createProductRequest';
import CreateProgramRequest from '../domain/entities/createProgramRequest';
import CreateQuoteDefinitionRequest from '../domain/entities/createQuoteDefinitionRequest';
import CreateRelatedFundRequest from '../domain/entities/CreateRelatedFundRequest';
import CreateRequirementDefinitionRequest, { CategoryCode, LevelCode, SeverityCode, StateCode } from '../domain/entities/createRequirementDefinitionRequest';
import CreateRequirementGroupRequest from '../domain/entities/createRequirementGroupRequest';
import CreateSecurityGroupRequest from '../domain/entities/CreateSecurityGroupRequest';
import CreateSegmentNameRequest from '../domain/entities/createSegmentNameRequest';
import CreateSegmentProgramRequest from '../domain/entities/CreateSegmentProgramRequest';
import CreateSqlScriptRequest from '../domain/entities/createSqlScriptRequest';
import CreateSystemDateRequest from '../domain/entities/createSystemDateRequest';
import CreateTransactionRuleRequest, { AttachedRuleDto, TransactionMapDto } from '../domain/entities/createTransactionRequest';
import CreateWorkflowTaskDefinitionRequest from '../domain/entities/createWorkflowTaskDefinitionRequest';
import Currency from '../domain/entities/currency';
import EntityAttachedRulesRequest from '../domain/entities/entityAttachedRulesRequest';
import MapKeyValue from '../domain/entities/mapKeyValue';
import Plan from '../domain/entities/plan';
import Product from '../domain/entities/product';
import ProgramDefinition from '../domain/entities/programDefinition';
import SegmentName from '../domain/entities/segmentName';
import SystemDate from '../domain/entities/systemDate';
import SystemDateFiltersContainer from '../domain/entities/systemDateFiltersContainer';
import EntityInformation from '../domain/entities/tabData/entityInformation';
import TransactionEligibilityStatus from '../domain/entities/transactionEligibilityStatus';
import TransactionType from '../domain/entities/transactionTypes';
import { EntityLevel } from '../domain/enums/entityLevel';
import { EntityType, toEntityType } from '../domain/enums/entityType';
import EntitiesRepository from '../domain/repositories/entitieRepository';

export default class EntityService {
    constructor(private entitiesRepository: EntitiesRepository) { }

    getBusinessRulesNames = async (typeCode: string): Promise<string[]> => {
        if (!typeCode) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getBusinessRulesNames(typeCode);
    };

    getAvailableProducts = async (companyGuid: string): Promise<Product[]> => {
        if (!companyGuid) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getAvailableProducts(companyGuid);
    };

    getCompanyProducts = async (companyGuid: string): Promise<MapKeyValue[]> => {
        if (!companyGuid) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getCompanyProducts(companyGuid);
    };

    getCurrencyCodes = async (): Promise<Currency[]> => {
        return this.entitiesRepository.getCurrencyCodes();
    };

    getCurrencies = async (): Promise<Currency[]> => {
        return this.entitiesRepository.getCurrencies();
    };

    getAvailablePlans = async (guid: string): Promise<Plan[]> => {
        if (!guid) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getAvailablePlans(guid);
    };

    getAvailableChildPlans = async (guid: string): Promise<Plan[]> => {
        if (!guid) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getAvailableChildPlans(guid);
    };

    getAllPlans = async (): Promise<Plan[]> => {
        return this.entitiesRepository.getAllPlans();
    };

    getAllSegmentNames = async (): Promise<SegmentName[]> => {
        return this.entitiesRepository.getAllSegmentNames();
    };

    getAllProgramDefinition = async (): Promise<ProgramDefinition[]> => {
        return this.entitiesRepository.getAllProgramDefinition();
    };

    getCompanyPlans = async (companyGuid: string): Promise<Plan[]> => {
        if (!companyGuid) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getCompanyPlans(companyGuid);
    };

    getStateCodes = async (): Promise<StateCode[]> => {
        return this.entitiesRepository.getStateCodes();
    };

    getSeverityCodes = async (): Promise<SeverityCode[]> => {
        return this.entitiesRepository.getSeverityCodes();
    };

    getMarketMaker = async (): Promise<BasicEntity[]> => {
        return this.entitiesRepository.getMarketMaker();
    };

    getCodes = async (type: string, useLongDescription?: boolean): Promise<BasicEntity[]> => {
        return this.entitiesRepository.getCodes(type, useLongDescription);
    };

    getChartAccounts = async (): Promise<BasicEntity[]> => {
        return this.entitiesRepository.getChartAccounts();
    };

    getChartAccountEntities = async (guid: string): Promise<BasicEntity[]> => {
        return this.entitiesRepository.getChartAccountEntities(guid);
    }

    getCategoryCodes = async (): Promise<CategoryCode[]> => {
        return this.entitiesRepository.getCategoryCode();
    };

    getLevelCodes = async (): Promise<LevelCode[]> => {
        return this.entitiesRepository.getLevelCodes();
    };

    getTransactionTypes = async (level: EntityLevel): Promise<TransactionType[]> => {
        if (!level) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getTransactionTypes(level);
    };

    getTransactionEligibilityStatuses = async (): Promise<TransactionEligibilityStatus[]> => {
        return this.entitiesRepository.getTransactionEligibilityStatuses();
    };

    getTransactionTranslations = async (name: string): Promise<TransactionMapDto[]> => {
        if (!name) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getTransactionTranslations(name);
    };

    getLevelAttachedRules = async (level: EntityLevel, searchQuery?: string): Promise<AttachedRuleDto[]> => {
        if (!level) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getLevelAttachedRules(level, searchQuery);
    };

    getAttachedRulesForEntity = async (guid: string, type: EntityType): Promise<string[]> => {
        if (!guid || !type) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getEntityAttachedRules(guid, type);
    };

    getEntityLevel = async (guid: string, type: EntityType): Promise<EntityLevel> => {
        return this.entitiesRepository.getEntityLevel(guid, type);
    };

    getSecurityGroups = async (companyGuid: string): Promise<BasicEntity[]> => {
        if (!companyGuid) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getSecurityGroups(companyGuid);
    };

    getAvailableBusinessRuleOverrides = async (typeCode: string, name: string): Promise<any[]> => {
        if (!typeCode || !name) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getAvailableBusinessRuleOverrides(typeCode, name);
    };

    getSegmentNameTypes = async (): Promise<MapKeyValue[]> => {
        return this.entitiesRepository.getSegmentNameTypes();
    };

    getInquiryScreenTypes = async (): Promise<MapKeyValue[]> => {
        return this.entitiesRepository.getInquiryScreenTypes();
    };

    getIntakeProfileDefinitionTypes = async (): Promise<MapKeyValue[]> => {
        return this.entitiesRepository.getIntakeProfileDefinitionTypes();
    };

    getSCompanies = async (): Promise<MapKeyValue[]> => {
        return this.entitiesRepository.getSCompanies();
    };

    getQuoteCodes = async (codeName: string): Promise<MapKeyValue[]> => {
        return this.entitiesRepository.getQuoteCodes(codeName);
    };

    getCountryCodes = async (): Promise<Country[]> => {
        return this.entitiesRepository.getCountryCodes();
    };

    createBusinessRule = async (businessRuleRequest: CreateBusinessRuleRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createBusinessRule(businessRuleRequest);
    };

    createAsFile = async (asFileRequest: CreateAsFileRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createAsFile(asFileRequest);
    };

    createFileOutput = async (fileOutputRequest: CreateFileOutputRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createFileOutput(fileOutputRequest);
    };

    createBatchScreen = async (createBatchScreenRequest: CreateBatchScreenRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createBatchScreen(createBatchScreenRequest);
    };

    createChartAccount = async (createChartAccountRequest: CreateChartAccountRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createChartAccount(createChartAccountRequest);
    };

    createChartAccountEntity = async (createChartAccountEntityRequest: CreateChartAccountEntityRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createChartAccountEntity(createChartAccountEntityRequest);
    };
    createChartAccountEntry = async (createChartAccountEntryRequest: CreateChartAccountEntryRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createChartAccountEntry(createChartAccountEntryRequest);
    };

    createCommentsTemplate = async (createCommentsTemplateRequest: CreateCommentsTemplateRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createCommentsTemplate(createCommentsTemplateRequest);
    };

    inquiryExist = async (inquiryRequest: CreateInquiryScreenRequest): Promise<boolean> => {
        return this.entitiesRepository.inquiryExist(inquiryRequest);
    };

    planProgramExist = async (planProgramRequest: CreatePlanProgramRequest): Promise<boolean> => {
        return this.entitiesRepository.planProgramExist(planProgramRequest);
    };

    segmentProgramExist = async (request: CreateSegmentProgramRequest): Promise<boolean> => {
        return this.entitiesRepository.segmentProgramExist(request);
    };

    createCompany = async (companyRequest: CreateCompanyRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createCompany(companyRequest);
    };

    createProduct = async (productRequest: CreateProductRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createProduct(productRequest);
    };

    createTransaction = async (transactionRequest: CreateTransactionRuleRequest): Promise<EntityInformation[]> => {
        return this.entitiesRepository.createTransaction(transactionRequest);
    };

    createActivityFilter = async (createActivityFilter: CreateActivityFilterRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createActivityFilter(createActivityFilter);
    };

    createRequirement = async (requirementRequest: CreateRequirementDefinitionRequest): Promise<EntityInformation[]> => {
        return this.entitiesRepository.createRequirement(requirementRequest);
    };

    createRequirementGroup = async (
        requirementGroupRequest: CreateRequirementGroupRequest,
    ): Promise<EntityInformation> => {
        return this.entitiesRepository.createRequirementGroup(requirementGroupRequest);
    };

    createInquiryScreen = async (inquiryRequest: CreateInquiryScreenRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createInquiry(inquiryRequest);
    };

    createPlanProgramDefinition = async (planProgramRequest: CreatePlanProgramRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createPlanProgramDefinition(planProgramRequest);
    };

    createSegmentProgramDefinition = async (request: CreateSegmentProgramRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createSegmentProgramDefinition(request);
    };

    createIntakeProfileDefinition = async (
        intakeProfileDefinitionRequest: CreateIntakeProfileDefinitionRequest,
    ): Promise<EntityInformation> => {
        return this.entitiesRepository.createIntakeProfileDefinition(intakeProfileDefinitionRequest);
    };

    getBusinessRules = async (typeCode: string): Promise<string[]> => {
        if (!typeCode) {
            return Promise.resolve([]);
        }
        return this.entitiesRepository.getBusinessRules(typeCode);
    };

    createExposedComputation = async (
        createExposedComputationRequest: CreateExposedComputationRequest,
    ): Promise<EntityInformation> => {
        return this.entitiesRepository.createExposedComputation(createExposedComputationRequest);
    };

    createSegment = async (segmentRequest: CreateSegmentNameRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createSegment(segmentRequest);
    };

    createMapGroup = async (mapGroupRequest: CreateMapRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createMapGroup(mapGroupRequest);
    };

    createPlan = async (planRequest: CreatePlanRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createPlan(planRequest);
    };

    createQuote = async (quoteRequest: CreateQuoteDefinitionRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createQuote(quoteRequest);
    };

    createProgram = async (ProgramRequest: CreateProgramRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createProgram(ProgramRequest);
    };

    createAgreement = async (AgreementRequest: CreateAgreementDefinitionRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createAgreement(AgreementRequest);
    };

    createSqlScript = async (SqlScriptRequest: CreateSqlScriptRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createSqlScript(SqlScriptRequest);
    };

    createMaskDetail = async (MaskDetailRequest: CreateMaskDetailRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createMaskDetail(MaskDetailRequest);
    };

    createSecurityGroup = async (SecurityGroupRequest: CreateSecurityGroupRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createSecurityGroup(SecurityGroupRequest);
    };

    createWorkflowTaskDefinition = async (
        WorkflowTaskDefinitionRequest: CreateWorkflowTaskDefinitionRequest,
    ): Promise<EntityInformation> => {
        return this.entitiesRepository.createWorkflowTaskDefinition(WorkflowTaskDefinitionRequest);
    };

    updateEntityAttachedRules = async (
        entityAttachedRulesRequest: EntityAttachedRulesRequest,
    ): Promise<EntityInformation[]> => {
        return this.entitiesRepository.updateEntityAttachedRules(entityAttachedRulesRequest);
    };

    createFund = async (fund: CreateFundRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createFund(fund);
    };

    createPlanFund = async (planFund: CreatePlanFundRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createPlanFund(planFund);
    };

    createRelatedFund = async (relatedFund: CreateRelatedFundRequest): Promise<EntityInformation> => {
        return this.entitiesRepository.createRelatedFund(relatedFund);
    };

    canDelete = async (entityType: EntityType, guid: string): Promise<boolean> => {
        return this.entitiesRepository.canDelete(toEntityType(entityType, true), guid);
    };

    delete = async (entityType: EntityType, guid: string) => {
        return this.entitiesRepository.delete(toEntityType(entityType, true), guid);
    };

    getAsFileId = async (guid: string): Promise<string> => {
        return this.entitiesRepository.getAsFileId(guid);
    };

    getSystemDates = async(month: string, year: string, calendarCode: string): Promise<SystemDate[]> => {
        return this.entitiesRepository.getSystemDates(month, year, calendarCode);
    }

    getSystemDateFilters = async(): Promise<SystemDateFiltersContainer>  => {
        return this.entitiesRepository.getSystemDateFilters();
    }

    createSystemDate = async(request: CreateSystemDateRequest) => {
        return this.entitiesRepository.createSystemDate(request)
    }

    getTransactionTypeCode = async(guid: string): Promise<TransactionType> => {
        return this.entitiesRepository.getTransactionTypeCode(guid)
    }

    getCalendarCodes = async (): Promise<Code[]> => {
        return this.entitiesRepository.getCalendarCodes();
    }
}
