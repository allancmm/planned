import AuthCompanyWebServiceData from '../../domain/entities/authCompanyWebServiceData';
import ChartOfAccountsMoneyType from '../../domain/entities/chartOfAccountsMoneyType';
import Code from '../../domain/entities/code';
import Country from '../../domain/entities/country';
import Currency from '../../domain/entities/currency';
import EntityField from '../../domain/entities/entityField';
import ErrorCatalog from '../../domain/entities/errorCatalog';
import FundField from '../../domain/entities/fundField';
import GenericRuleField from '../../domain/entities/genericRuleField';
import MapRow from '../../domain/entities/mapRow';
import MarketMaker from '../../domain/entities/marketMaker';
import AuthSecurityGroupData from '../../domain/entities/authSecurityGroupData';
import PlanFundStatus from '../../domain/entities/planFundStatus';
import PlanStateApproval from '../../domain/entities/planStateApproval';
import RequirementCriterion from '../../domain/entities/requirementCriterion';
import Sequence from '../../domain/entities/sequence';
import Translation from '../../domain/entities/translation';
import WorkflowQueueRole from '../../domain/entities/workflowQueueRole';
import { EntityType } from '../../domain/enums/entityType';
import SecurityGroupData from "../../domain/entities/securityGroupData";
import ChartOfAccountsCriteria from '../../domain/entities/chartOfAccountsCriteria';
import ChartOfAccountsResult from '../../domain/entities/chartOfAccountsResult';
import CompanySecurityData from "../../domain/entities/companySecurityData";

export class CheckInData {
    constructor(public fileType: string = '') { }
}

export class CheckInDataString extends CheckInData {
    public fileData: string = '';
}

export class CheckInDataField extends CheckInData {
    public dataFields: GenericRuleField[] = [];
}

export class CheckInDataSecurityGroup extends CheckInData {
    public dataFields: GenericRuleField[] = [];
    public securityGroupData: SecurityGroupData[] = [];
    public masksSecurityData: AuthSecurityGroupData[] = [];
    public fieldsSecurityData: AuthSecurityGroupData[] = [];
    public companySecurityData: CompanySecurityData[] = [];
    public webServiceSecurityData: AuthCompanyWebServiceData[] = []
    public globalSelectedOverrideGuid: string='';
    public overrideTypeCode: string='';
    public securityGroupGuid: string='';
}

export class CheckInDataTranslation extends CheckInData {
    public translations: Translation[] = [];
}

export class CheckInDataCode extends CheckInData {
    public codes: Code[] = [];
    public isNew: boolean = false;
}

export class CheckInDataErrorCatalog extends CheckInData {
    public errorCatalogs: ErrorCatalog[] = [];
}

export class CheckInDataCountry extends CheckInData {
    public countries: Country[] = [];
}

export class CheckInDataCurrency extends CheckInData {
    public currencies: Currency[] = [];
}

export class CheckInDataMarketMaker extends CheckInData {
    public marketMakers: MarketMaker[] = [];
}

export class CheckInDataMap extends CheckInData {
    public rows: MapRow[] = [];
    public mapDescription: string = '';
    public isNew: boolean = false;
}

export class CheckInDataSequence extends CheckInData {
    public sequences: Sequence[] = [];
}

export class CheckInGroup extends CheckInData {
    public criteria: RequirementCriterion[] = [];
}

export class CheckInWorkflowQueueRole extends CheckInData {
    public workflowQueueRoles: WorkflowQueueRole[] = [];
}

export class CheckInPlanFundStatus extends CheckInData {
    public planFundStatus: PlanFundStatus[] = [];
}

export class CheckInChartCriteria extends CheckInData {
    public chartOfAccountsCriterias: ChartOfAccountsCriteria [] = [];
}

export class CheckInChartResult extends CheckInData {
    public chartOfAccountsResults: ChartOfAccountsResult [] = [];
}

export class CheckInChartMoneyType extends CheckInData {
    public chartOfAccountsMoneyTypes: ChartOfAccountsMoneyType [] = [];
}

export class CheckInFundField extends CheckInData {
    public fundFields: FundField[] = [];
    public childFundFields: FundField[] = [];
    public benefitFundFields: FundField[] = [];
    public lateralFundFields: FundField[] = [];
}

export class CheckInPlanStateApproval extends CheckInData {
    public planStateApprovals: PlanStateApproval[] = [];
}

export class CheckInEntityField extends CheckInData {
    public entityType: EntityType = '';
    public entityFields: EntityField[] = [];
}

export default class CheckInRequest {
    public entityType: EntityType = '';
    public comments: string = '';
    public label: string = '';
    public data: CheckInData[] = [];
}
