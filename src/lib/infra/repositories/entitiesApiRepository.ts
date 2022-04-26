import BasicEntity from '../../domain/entities/basicEntity';
import Code from '../../domain/entities/code';
import Country from '../../domain/entities/country';
import CreateActivityFilterRequest from '../../domain/entities/createActivityFilterRequest';
import CreateAgreementDefinitionRequest from '../../domain/entities/createAgreementDefinitionRequest';
import CreateAsFileRequest from '../../domain/entities/createAsFileRequest';
import CreateBatchScreenRequest from '../../domain/entities/createBatchScreenRequest';
import CreateBusinessRuleRequest from '../../domain/entities/createBusinessRuleRequest';
import CreateChartAccountEntityRequest from '../../domain/entities/createChartAccountEntityRequest';
import CreateChartAccountEntryRequest from '../../domain/entities/createChartAccountEntryRequest';
import CreateChartAccountRequest from '../../domain/entities/createChartAccountRequest';
import CreateCommentsTemplateRequest from '../../domain/entities/createCommentsTemplateRequest';
import CreateCompanyRequest from '../../domain/entities/createCompanyRequest';
import CreateExposedComputationRequest from '../../domain/entities/createExposedComputationRequest';
import CreateFileOutputRequest from '../../domain/entities/createFileOutputRequest';
import CreateFundRequest from '../../domain/entities/createFundRequest';
import CreateInquiryScreenRequest from '../../domain/entities/createInquiryScreenRequest';
import CreateIntakeProfileDefinitionRequest from '../../domain/entities/createIntakeProfileDefinitionRequest';
import CreateMapRequest from '../../domain/entities/CreateMapRequest';
import CreateMaskDetailRequest from '../../domain/entities/createMaskDetailRequest';
import CreatePlanFundRequest from '../../domain/entities/createPlanFundRequest';
import CreatePlanProgramRequest from '../../domain/entities/CreatePlanProgramRequest';
import CreatePlanRequest from '../../domain/entities/createPlanRequest';
import CreateProductRequest from '../../domain/entities/createProductRequest';
import CreateProgramRequest from '../../domain/entities/createProgramRequest';
import CreateQuoteDefinitionRequest from '../../domain/entities/createQuoteDefinitionRequest';
import CreateRelatedFundRequest from '../../domain/entities/CreateRelatedFundRequest';
import CreateRequirementDefinitionRequest, { CategoryCode, LevelCode, SeverityCode, StateCode } from '../../domain/entities/createRequirementDefinitionRequest';
import CreateRequirementGroupRequest from '../../domain/entities/createRequirementGroupRequest';
import CreateSecurityGroupRequest from '../../domain/entities/CreateSecurityGroupRequest';
import CreateSegmentNameRequest from '../../domain/entities/createSegmentNameRequest';
import CreateSegmentProgramRequest from '../../domain/entities/CreateSegmentProgramRequest';
import CreateSqlScriptRequest from '../../domain/entities/createSqlScriptRequest';
import CreateSystemDateRequest from '../../domain/entities/createSystemDateRequest';
import CreateTransactionRuleRequest, { AttachedRuleDto, TransactionMapDto } from '../../domain/entities/createTransactionRequest';
import CreateWorkflowTaskDefinitionRequest from '../../domain/entities/createWorkflowTaskDefinitionRequest';
import Currency from '../../domain/entities/currency';
import EntityAttachedRulesRequest from '../../domain/entities/entityAttachedRulesRequest';
import MapKeyValue from '../../domain/entities/mapKeyValue';
import Plan from '../../domain/entities/plan';
import Product from '../../domain/entities/product';
import ProgramDefinition from '../../domain/entities/programDefinition';
import SegmentName from '../../domain/entities/segmentName';
import SystemDate from '../../domain/entities/systemDate';
import SystemDateFiltersContainer from '../../domain/entities/systemDateFiltersContainer';
import EntityInformation from '../../domain/entities/tabData/entityInformation';
import TransactionEligibilityStatus from '../../domain/entities/transactionEligibilityStatus';
import TransactionType from '../../domain/entities/transactionTypes';
import { EntityLevel } from '../../domain/enums/entityLevel';
import { EntityType } from '../../domain/enums/entityType';
import EntitiesRepository from '../../domain/repositories/entitieRepository';
import { ApiGateway } from '../config/apiGateway';

export default class EntitiesApiRepository implements EntitiesRepository {
    constructor(private api: ApiGateway) { }
    getCompanyPlans = async (companyGuid: string): Promise<Plan[]> => {
        return this.api.getArray(`/entities/companyPlans?guid=${companyGuid}`, { outType: Plan });
    };

    getCompanyProducts = async (companyGuid: string): Promise<MapKeyValue[]> => {
        return this.api.getArray(`/entities/companyProducts?companyGuid=${companyGuid}`, { outType: MapKeyValue });
    };

    getBusinessRulesNames = async (typeCode: string): Promise<string[]> => {
        return this.api.getArray(`/entities/businessRulesNames?typeCode=${typeCode}`);
    };

    getAvailableBusinessRuleOverrides = async (typeCode: string, name: string): Promise<any[]> => {
        return this.api.getArray(`/entities/availableBusinessRuleOverrides?typeCode=${typeCode}&name=${name}`);
    };

    getAvailableProducts = async (companyGuid: string): Promise<Product[]> => {
        return this.api.getArray(`/entities/availableProducts?guid=${companyGuid}`, { outType: Product });
    };

    getCurrencyCodes = async (): Promise<Currency[]> => {
        return this.api.getArray(`/entities/simpleCurrency`);
    };

    getCurrencies = async (): Promise<Currency[]> => {
        return this.api.getArray(`/entities/currencies`);
    };

    getSecurityGroups = async (companyGuid: string): Promise<BasicEntity[]> => {
        return this.api.getArray(`/entities/basic/securityGroups?companyGuid=${companyGuid}`);
    };
    
    getTransactionTypes = async (level: EntityLevel): Promise<TransactionType[]> => {
        return this.api.getArray(`/entities/transactionTypes?level=${level}`, { outType: TransactionType });
    };

    getSegmentNameTypes = async (): Promise<MapKeyValue[]> => {
        return this.api.getArray('/entities/segmentNameTypes', { outType: MapKeyValue });
    };

    getQuoteCodes = async (codeName: string): Promise<MapKeyValue[]> => {
        return this.api.getArray(`/entities/quoteCodes?codeName=${codeName}`, { outType: MapKeyValue });
    };

    getInquiryScreenTypes = async (): Promise<MapKeyValue[]> => {
        return this.api.getArray('/entities/inquiryScreenTypes', { outType: MapKeyValue });
    };

    getIntakeProfileDefinitionTypes = async (): Promise<MapKeyValue[]> => {
        return this.api.getArray('/entities/intakeProfileDefinitionTypes', { outType: MapKeyValue });
    };

    getSCompanies = async (): Promise<MapKeyValue[]> => {
        return this.api.getArray('/entities/sCompanies', { outType: MapKeyValue });
    };

    getLevelAttachedRules = async (level: EntityLevel, searchQuery?: string): Promise<AttachedRuleDto[]> => {
        return this.api.getArray(
            `/entities/levelAttachedRules?level=${level}${searchQuery ? `&searchQuery=${searchQuery}` : ''}`,
            { outType: AttachedRuleDto },
        );
    };

    getEntityAttachedRules = async (guid: string, type: EntityType): Promise<string[]> => {
        return this.api.getArray(`/entities/attachedRulesForEntity?guid=${guid}&type=${type}`);
    };

    getEntityLevel = async (guid: string, type: EntityType): Promise<EntityLevel> => {
        return this.api.get(`/entities/level?guid=${guid}&type=${type}`);
    };

    getTransactionEligibilityStatuses = async (): Promise<TransactionEligibilityStatus[]> => {
        return this.api.getArray(`/entities/transactionEligibilityStatues`, { outType: TransactionEligibilityStatus });
    };

    inquiryExist = async (inquiryRequest: CreateInquiryScreenRequest): Promise<boolean> => {
        return this.api.post('/entities/inquiryScreenExist', inquiryRequest, {
            inType: CreateInquiryScreenRequest,
        });
    };

    planProgramExist = async (planProgramRequest: CreatePlanProgramRequest): Promise<boolean> => {
        return this.api.post('/entities/planProgramExist', planProgramRequest, {
            inType: CreatePlanProgramRequest,
        });
    };

    segmentProgramExist = async (request: CreateSegmentProgramRequest): Promise<boolean> => {
        return this.api.post('/entities/segmentProgramExist', request, {
            inType: CreateSegmentProgramRequest,
        });
    };

    getTransactionTranslations = async (name: string): Promise<TransactionMapDto[]> => {
        return this.api.getArray(`/entities/transactionTranslations?name=${name}`, { outType: TransactionMapDto });
    };

    getAvailablePlans = async (productGuid: string): Promise<Plan[]> => {
        return this.api.getArray(`/entities/availablePlans?guid=${productGuid}`, { outType: Plan });
    };

    getAvailableChildPlans = async (productGuid: string): Promise<Plan[]> => {
        return this.api.getArray(`/entities/availableChildPlans?productGuid=${productGuid}`, { outType: Plan });
    };


    getAllPlans = async (): Promise<Plan[]> => {
        return this.api.getArray(`/entities/plans`, { outType: Plan });
    };

    getAllSegmentNames = async (): Promise<SegmentName[]> => {
        return this.api.getArray(`/entities/segmentNames`, { outType: SegmentName });
    };

    getAllProgramDefinition = async (): Promise<ProgramDefinition[]> => {
        return this.api.getArray(`/entities/programsDefinition`, { outType: ProgramDefinition });
    };

    getStateCodes = async (): Promise<StateCode[]> => {
        return this.api.getArray('/entities/stateCodes', { outType: StateCode });
    };

    getSeverityCodes = async (): Promise<SeverityCode[]> => {
        return this.api.getArray('/entities/severityCodes', { outType: SeverityCode });
    };

    getLevelCodes = async (): Promise<LevelCode[]> => {
        return this.api.getArray('/entities/levelCodes', { outType: LevelCode });
    };

    getCategoryCode = async (): Promise<CategoryCode[]> => {
        return this.api.getArray('/entities/categoryCodes', { outType: CategoryCode });
    };

    createBusinessRule = async (businessRuleRequest: CreateBusinessRuleRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/businessRule', businessRuleRequest, {
            inType: CreateBusinessRuleRequest,
            outType: EntityInformation,
        });
    };

    createAsFile = async (asFileRequest: CreateAsFileRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/asfile', asFileRequest, {
            inType: CreateAsFileRequest,
            outType: EntityInformation,
        });
    };

    createFileOutput = async (fileOutputRequest: CreateFileOutputRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/fileOutput', fileOutputRequest, {
            inType: CreateFileOutputRequest,
            outType: EntityInformation,
        });
    };

    createBatchScreen = async (createBatchScreenRequest: CreateBatchScreenRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/batchScreen', createBatchScreenRequest, {
            inType: CreateBatchScreenRequest,
            outType: EntityInformation,
        });
    };

    createCommentsTemplate = async (createCommentsTemplateRequest: CreateCommentsTemplateRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/commentsTemplate', createCommentsTemplateRequest, {
            inType: CreateCommentsTemplateRequest,
            outType: EntityInformation,
        });
    };

    createChartAccount = async (createChartAccountRequest: CreateChartAccountRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/chartOfAccounts', createChartAccountRequest, {
            inType: CreateChartAccountRequest,
            outType: EntityInformation,
        });
    };

    createChartAccountEntity = async (createChartAccountEntityRequest: CreateChartAccountEntityRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/chartOfAccounts/entity', createChartAccountEntityRequest, {
            inType: CreateChartAccountEntityRequest,
            outType: EntityInformation,
        });
    };

    createChartAccountEntry = async (createChartAccountEntryRequest: CreateChartAccountEntryRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/chartOfAccounts/entry', createChartAccountEntryRequest, {
            inType: CreateChartAccountEntryRequest,
            outType: EntityInformation,
        });
    };

    createProduct = async (productRequest: CreateProductRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/product', productRequest, {
            inType: CreateProductRequest,
            outType: EntityInformation,
        });
    };

    createCompany = async (companyRequest: CreateCompanyRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/company', companyRequest, {
            inType: CreateCompanyRequest,
            outType: EntityInformation,
        });
    };

    createTransaction = async (transactionRequest: CreateTransactionRuleRequest): Promise<EntityInformation[]> => {
        return this.api.postReturnArray('/entities/create/transaction', transactionRequest, {
            inType: CreateTransactionRuleRequest,
            outType: EntityInformation,
        });
    };

    createActivityFilter = async (createActivityFilter: CreateActivityFilterRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/activityFilter', createActivityFilter, {
            inType: CreateActivityFilterRequest,
            outType: EntityInformation,
        });
    };

    createRequirement = async (request: CreateRequirementDefinitionRequest): Promise<EntityInformation[]> => {
        return this.api.postReturnArray('/entities/create/requirement', request, {
            inType: CreateRequirementDefinitionRequest,
            outType: EntityInformation,
        });
    };

    createRequirementGroup = async (
        requirementGroupRequest: CreateRequirementGroupRequest,
    ): Promise<EntityInformation> => {
        return this.api.post('/entities/create/requirementGroup', requirementGroupRequest, {
            inType: CreateRequirementGroupRequest,
            outType: EntityInformation,
        });
    };

    createInquiry = async (request: CreateInquiryScreenRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/inquiryScreen', request, {
            inType: CreateInquiryScreenRequest,
            outType: EntityInformation,
        });
    };

    createPlanProgramDefinition = async (planProgramRequest: CreatePlanProgramRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/program/linkplan', planProgramRequest, {
            inType: CreatePlanProgramRequest,
            outType: EntityInformation,
        });
    };

    createSegmentProgramDefinition = async (request: CreateSegmentProgramRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/program/linksegment', request, {
            inType: CreateSegmentProgramRequest,
            outType: EntityInformation,
        });
    };

    createIntakeProfileDefinition = async (
        request: CreateIntakeProfileDefinitionRequest,
    ): Promise<EntityInformation> => {
        return this.api.post('/entities/create/intakeprofiledefinition', request, {
            inType: CreateIntakeProfileDefinitionRequest,
            outType: EntityInformation,
        });
    };

    createSegment = async (request: CreateSegmentNameRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/segmentName', request, {
            inType: CreateSegmentNameRequest,
            outType: EntityInformation,
        });
    };

    createMapGroup = async (request: CreateMapRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/mapGroup', request, {
            inType: CreateMapRequest,
            outType: EntityInformation,
        });
    }

    createPlan = async (request: CreatePlanRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/plan', request, {
            inType: CreatePlanRequest,
            outType: EntityInformation,
        });
    };

    createQuote = async (request: CreateQuoteDefinitionRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/quote', request, {
            inType: CreateQuoteDefinitionRequest,
            outType: EntityInformation,
        });
    };

    getMarketMaker = async (): Promise<BasicEntity[]> => {
        return this.api.getArray('/entities/marketMaker', { outType: BasicEntity });
    };

    createProgram = async (request: CreateProgramRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/program', request, {
            inType: CreateProgramRequest,
            outType: EntityInformation,
        });
    };

    createAgreement = async (request: CreateAgreementDefinitionRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/agreementdefinition', request, {
            inType: CreateAgreementDefinitionRequest,
            outType: EntityInformation,
        });
    };

    getBusinessRules = async (typeCode: string): Promise<string[]> => {
        return this.api.getArray(`/entities/businessRules?typeCode=${typeCode}`);
    };

    createExposedComputation = async (request: CreateExposedComputationRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/exposedComputation', request, {
            inType: CreateExposedComputationRequest,
            outType: EntityInformation,
        });
    };
    createSqlScript = async (request: CreateSqlScriptRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/sqlscript', request, {
            inType: CreateSqlScriptRequest,
            outType: EntityInformation,
        });
    };

    getCodes = async (type: string, useLongDescription?: boolean): Promise<BasicEntity[]> => {
        return this.api.getArray(`/entities/code?type=${type}${useLongDescription ? '&useLongDescription=true' : ''}`, {
            outType: BasicEntity,
        });
    };

    getChartAccounts = async (): Promise<BasicEntity[]> => {
        return this.api.getArray(`/entities/chartAccounts`, {
            outType: BasicEntity,
        });
    };

    getChartAccountEntities = async (guid: string): Promise<BasicEntity[]> => {
        return this.api.getArray(`/entities/chartAccountEntities?chartAccountGuid=${guid}`, {
            outType: BasicEntity,
        });
    };

    getCountryCodes = async (): Promise<Country[]> => {
        return this.api.getArray(`/entities/countryCodes`);
    };

    createMaskDetail = async (request: CreateMaskDetailRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/maskDetail', request, {
            inType: CreateMaskDetailRequest,
            outType: EntityInformation,
        });
    };

    createSecurityGroup = async (request: CreateSecurityGroupRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/oipasecuritygroup', request, {
            inType: CreateSecurityGroupRequest,
            outType: EntityInformation,
        });
    };

    createWorkflowTaskDefinition = async (request: CreateWorkflowTaskDefinitionRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/workflowtaskdefinition', request, {
            inType: CreateWorkflowTaskDefinitionRequest,
            outType: EntityInformation,
        });
    };

    updateEntityAttachedRules = async (
        entityAttachedRulesRequest: EntityAttachedRulesRequest,
    ): Promise<EntityInformation[]> => {
        return this.api.postReturnArray('/entities/create/entityAttachedRules', entityAttachedRulesRequest, {
            inType: EntityAttachedRulesRequest,
            outType: EntityInformation,
        });
    };

    createFund = async (fund: CreateFundRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/fund', fund, {
            inType: CreateFundRequest,
            outType: EntityInformation,
        })
    };

    createPlanFund = async (fund: CreatePlanFundRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/fund/planfund', fund, {
            inType: CreatePlanFundRequest,
            outType: EntityInformation,
        })
    };

    createRelatedFund = async (relatedFund: CreateRelatedFundRequest): Promise<EntityInformation> => {
        return this.api.post('/entities/create/fund/relatedFund', relatedFund, {
            inType: CreateRelatedFundRequest,
            outType: EntityInformation,
        })
    };

    canDelete = async (entityType: EntityType, guid: string): Promise<boolean> => {
        return this.api.get(`/entities/delete/${entityType}/${guid}/permission`);
    };

    delete = async (entityType: EntityType, guid: string): Promise<void> => {
        return this.api.delete(`/entities/delete/${entityType}/${guid}`);
    };

    getAsFileId = async (guid: string): Promise<string> => {
        return this.api.get(`/entities/asFileId/?guid=${guid}`);
    };

    getSystemDates = async (month: string, year: string, calendarCode: string): Promise<SystemDate[]> => {
        let apiCall = `/entities/systemDates`
        const param: string[] = [];
        if(month) {
            param.push(`month=${month}`);
        }
        if(year) {
            param.push(`year=${year}`)
        }
        if(calendarCode) {
            param.push(`calendarCode=${calendarCode}`)
        }
        apiCall += param.length > 0 ? '/?' + param.join('&') : '';
        return this.api.getArray(apiCall, {outType: SystemDate})
    }

    getSystemDateFilters = async (): Promise<SystemDateFiltersContainer> => {
        return this.api.get('/entities/systemDates/filters', {outType: SystemDateFiltersContainer})
    }
    createSystemDate = async(request: CreateSystemDateRequest): Promise<void> => {
        return this.api.post('/entities/create/systemDates', request, {
            inType: CreateSystemDateRequest,
        })
    }

    getTransactionTypeCode = async (guid: string): Promise<TransactionType> => {
        return this.api.get(`/entities/transactionType/?guid=${guid}`, { outType: TransactionType });
    };

    getCalendarCodes = async(): Promise<Code[]> => {
        return this.api.getArray('/entities/calendarCodes', { outType: Code })
    }
}
