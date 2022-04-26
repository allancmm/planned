import { Expose, Type } from 'class-transformer';
import { EntityType } from '../../enums/entityType';
import { FileType } from '../../enums/fileType';
import Code from '../code';
import Country from '../country';
import Currency from '../currency';
import EntityField from '../entityField';
import ErrorCatalog from '../errorCatalog';
import FundField from '../fundField';
import GenericRuleField from '../genericRuleField';
import MapGroup from '../mapGroup';
import AuthSecurityGroupData from '../authSecurityGroupData';
import MarketMaker from '../marketMaker';
import OipaRule from '../oipaRule';
import PlanFundStatus from '../planFundStatus';
import PlanStateApproval from '../planStateApproval';
import RateGroup from '../rateGroup';
import RequirementCriterion from '../requirementCriterion';
import Sequence from '../sequence';
import TestSuite from '../testSuite';
import Translation from '../translation';
import WorkflowQueueRole from '../workflowQueueRole';
import InterpreterSession from './interpreterSession';
import { ITabData } from './iTabData';
import SecurityGroupData from "../securityGroupData";
import ChartOfAccountsCriteria from '../chartOfAccountsCriteria';
import ChartOfAccountsResult from '../chartOfAccountsResult';
import ChartOfAccountsMoneyType from '../chartOfAccountsMoneyType';
import CompanySecurityData from "../companySecurityData";
import AuthCompanyWebServiceData from "../authCompanyWebServiceData";
import BasicEntity from "../basicEntity";

export default class EntityInformation extends ITabData {
    clazz: string = 'EntityInformation';

    @Type(() => OipaRule) public oipaRule: OipaRule = new OipaRule();
    public typeCode: string = '';
    public dataFields: GenericRuleField[] = [];
    public dataString: string = '';
    public fileType: FileType = 'DEFAULT';
    public entityType: EntityType = '';
    public companyGuid: string = '';
    public folderType: string = '';
    public planGuid: string = '';
    public overrideTypeCode: string = '';
    public globalSelectedOverrideGuid: string = '';
    public securityGroupGuid: string ='';
    public productTransactionGuid: string = '';
    public maskSecurityLevelCodes: GenericRuleField[] =[];
    public fieldSecurityLevelCodes: GenericRuleField[] =[];
    public primaryCompany: boolean = true;
    public moneyTypeCodes: BasicEntity[] = [];
    @Type(() => OipaRule) public relatedEntities: OipaRule[] = [];
    @Type(() => TestSuite) public testSuite: TestSuite | null = null;
    @Type(() => Translation) public translations: Translation[] = [];
    @Type(() => Code) public codes: Code[] = [];
    @Type(() => MapGroup) public mapData: MapGroup = new MapGroup();
    @Type(() => ErrorCatalog) public errorCatalogs: ErrorCatalog[] = [];
    @Type(() => Currency) public currencies: Currency[] = [];
    @Type(() => Country) public countries: Country[] = [];
    @Type(() => MarketMaker) public marketMakers: MarketMaker[] = [];
    @Type(() => Sequence) public sequences: Sequence[] = [];
    @Type(() => SecurityGroupData) public securityGroupData: SecurityGroupData[] = [];
    @Type(() => RequirementCriterion) public criteria: RequirementCriterion[] = [];
    @Type(() => WorkflowQueueRole) public workflowQueueRoles: WorkflowQueueRole[] = [];
    @Type(() => RateGroup) public rateGroup: RateGroup = new RateGroup();
    @Type(() => PlanFundStatus) public planFundStatus: PlanFundStatus[] = [];
    @Type(() => PlanStateApproval) public planStateApprovals: PlanStateApproval[] = [];
    @Type(() => FundField) public fundFields: FundField[] = [];
    @Type(() => FundField) public childFundFields: FundField[] = [];
    @Type(() => FundField) public benefitFundFields: FundField[] = [];
    @Type(() => FundField) public lateralFundFields: FundField[] = [];
    @Type(() => EntityField) public entityFields: EntityField[] = [];
    @Type(() => AuthSecurityGroupData) public maskSecurityData: AuthSecurityGroupData[] = [];
    @Type(() => AuthSecurityGroupData) public fieldSecurityData: AuthSecurityGroupData[] = [];
    @Type(() => ChartOfAccountsCriteria) public chartOfAccountsCriterias: ChartOfAccountsCriteria[] = [];
    @Type(() => ChartOfAccountsResult) public chartOfAccountsResults: ChartOfAccountsResult[] = [];
    @Type(() => ChartOfAccountsMoneyType) public chartOfAccountsMoneyTypes: ChartOfAccountsMoneyType[] = [];
    @Type(() => CompanySecurityData) public companySecurityData: CompanySecurityData[] = [];
    @Type(() => AuthCompanyWebServiceData)
    public authCompanyWebServiceData: AuthCompanyWebServiceData[] = [];

    public extras: { [key: string]: any } = {};

    @Expose({ groups: ['cache'] })
    public interpreterOpened = false;

    private checksum: string | null = null;

    getChecksum = () => {
        return this.checksum
    }

    generateTabId(): string {
        return `${this.getGuid()} - ${this.fileType}`;
    }

    generateInterpreterTabId(): string {
        return `${this.getGuid()} - interpreter`;
    }

    getGuid(): string {
        return this.oipaRule.ruleGuid;
    }

    getName(): string {
        return this.oipaRule.ruleName;
    }
    getType(): EntityType {
        return this.entityType;
    }
    getExtra(): string {
        return this.oipaRule.override.overrideName;
    }

    getCompanyGuid(): string {
        return this.companyGuid;
    }

    getPlanGuid(): string {
        return this.planGuid;
    }

    getOverrideTypeCode(): string {
        return this.overrideTypeCode;
    }

    getProductTransactionGuid = (): string => this.productTransactionGuid;

    createInterpreterData(interpreterGuid: string, interpreterEntityType: EntityType): InterpreterSession {
        const data = new InterpreterSession();
        data.oipaRule = this.oipaRule;
        data.typeCode = this.typeCode;
        data.testSuite = this.testSuite ?? new TestSuite();
        data.interpreterRuleGuid = interpreterGuid;
        data.interpreterEntityType = interpreterEntityType;
        return data;
    }
}
