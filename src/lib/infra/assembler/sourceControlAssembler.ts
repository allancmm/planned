import { TabItem } from '../../../components/editor/tabs/tabReducerTypes';
import EntityInformation from '../../domain/entities/tabData/entityInformation';
import { EntityType } from '../../domain/enums/entityType';
import { fileTypeToDisplayName } from '../../domain/enums/fileType';
import CheckInRequest, {
    CheckInChartCriteria,
    CheckInChartResult,
    CheckInChartMoneyType,
    CheckInDataCode,
    CheckInDataCountry,
    CheckInDataCurrency,
    CheckInDataErrorCatalog,
    CheckInDataField,
    CheckInDataMap,
    CheckInDataMarketMaker,
    CheckInDataSecurityGroup,
    CheckInDataSequence,
    CheckInDataString,
    CheckInDataTranslation, CheckInFundField,
    CheckInGroup, CheckInPlanFundStatus, CheckInPlanStateApproval,
    CheckInWorkflowQueueRole, CheckInEntityField
} from '../request/checkInRequest';

export const toCheckInRequest = (tabs: TabItem[]): CheckInRequest => {
    const request = new CheckInRequest();
    if (tabs.length > 0) {
        const entityType: EntityType = tabs[0].data.getType();
        request.entityType = entityType;
        request.data = tabs
            .filter((t) => t.data instanceof EntityInformation)
            .map((t) => {
                const checkInData = [];

                const tabData = t.data as EntityInformation;
                if (tabData.fileType === 'DATA') {
                    const d = new CheckInDataField(fileTypeToDisplayName(tabData.fileType));
                    d.dataFields = tabData.dataFields;
                    checkInData.push(d);
                    if (entityType === 'TRANSACTIONS') {
                        const td = new CheckInDataTranslation(fileTypeToDisplayName('TRANSLATION'));
                        td.translations = tabData.translations;
                        checkInData.push(td);

                    } else if (entityType === 'CHART_OF_ACCOUNTS_ENTRY') {
                        const p = new CheckInChartCriteria(fileTypeToDisplayName('CHART_ACCOUNT_CRITERIA'))
                        p.chartOfAccountsCriterias = (t.data as EntityInformation).chartOfAccountsCriterias;
                        checkInData.push(p);

                        const r = new CheckInChartResult(fileTypeToDisplayName('CHART_ACCOUNT_RESULT'))
                        r.chartOfAccountsResults = (t.data as EntityInformation).chartOfAccountsResults;
                        checkInData.push(r);

                        const m = new CheckInChartMoneyType(fileTypeToDisplayName('CHART_ACCOUNT_MONEY_TYPE'))
                            m.chartOfAccountsMoneyTypes = (t.data as EntityInformation).chartOfAccountsMoneyTypes;
                        checkInData.push(m);
                    } else if (entityType === 'PLANFUND') {
                        const p = new CheckInPlanFundStatus(fileTypeToDisplayName('PLAN_FUND_STATUS'))
                        p.planFundStatus = (t.data as EntityInformation).planFundStatus;
                        checkInData.push(p);
                    } else if (['FUND', 'CHILD_FUNDS', 'BENEFIT_FUNDS', 'LATERAL_FUNDS'].includes(entityType)) {
                        const p = new CheckInFundField(fileTypeToDisplayName('FUND_FIELD'))
                        p.fundFields = (t.data as EntityInformation).fundFields;
                        if (entityType === 'CHILD_FUNDS') {
                            p.childFundFields = (t.data as EntityInformation).childFundFields;
                        }
                        if (entityType === 'BENEFIT_FUNDS') {
                            p.childFundFields = (t.data as EntityInformation).childFundFields;
                            p.benefitFundFields = (t.data as EntityInformation).benefitFundFields;
                        }
                        if (entityType === 'LATERAL_FUNDS') {
                            p.lateralFundFields = (t.data as EntityInformation).lateralFundFields;
                        }
                        checkInData.push(p);
                    } else if (entityType === 'PLAN' || entityType === 'COMPANY') {
                        const f = new CheckInEntityField(fileTypeToDisplayName('ENTITY_FIELD'))
                        f.entityFields = (t.data as EntityInformation).entityFields;
                        f.entityType = entityType;
                        checkInData.push(f);
                    }
                } else if (tabData.fileType === 'SECURITY_DATA') {
                    const sgd = new CheckInDataSecurityGroup(fileTypeToDisplayName('SECURITY_DATA'));
                    sgd.dataFields = tabData.dataFields;
                    sgd.securityGroupData = tabData.securityGroupData;
                    sgd.masksSecurityData = tabData.maskSecurityData;
                    sgd.fieldsSecurityData = tabData.fieldSecurityData;
                    sgd.companySecurityData = tabData.companySecurityData;
                    sgd.webServiceSecurityData = tabData.authCompanyWebServiceData;
                    sgd.overrideTypeCode = tabData.oipaRule.override.overrideTypeCode;
                    sgd.globalSelectedOverrideGuid =  tabData.oipaRule.override.overrideTypeCode === 'Global' ? tabData.globalSelectedOverrideGuid : '';
                    sgd.securityGroupGuid =  tabData.oipaRule.override.overrideTypeCode === 'Global' ? tabData.securityGroupGuid : '';
                    checkInData.push(sgd);
                } else if (tabData.fileType === 'CODE') {
                    const d = new CheckInDataCode(fileTypeToDisplayName(tabData.fileType));
                    d.codes = (t.data as EntityInformation).codes;
                    d.isNew = (t.data as EntityInformation).status.versionNumber === 0;
                    checkInData.push(d);
                } else if (tabData.fileType === 'ERROR_CATALOG') {
                    const ec = new CheckInDataErrorCatalog(fileTypeToDisplayName(tabData.fileType));
                    ec.errorCatalogs = (t.data as EntityInformation).errorCatalogs;
                    checkInData.push(ec);
                } else if (tabData.fileType === 'COUNTRY') {
                    const c = new CheckInDataCountry(fileTypeToDisplayName(tabData.fileType));
                    c.countries = (t.data as EntityInformation).countries;
                    checkInData.push(c);
                } else if (tabData.fileType === 'CURRENCY') {
                    const c = new CheckInDataCurrency(fileTypeToDisplayName(tabData.fileType));
                    c.currencies = (t.data as EntityInformation).currencies;
                    checkInData.push(c);
                } else if (tabData.fileType === 'MARKET_MAKER') {
                    const c = new CheckInDataMarketMaker(fileTypeToDisplayName(tabData.fileType));
                    c.marketMakers = (t.data as EntityInformation).marketMakers;
                    checkInData.push(c);
                } else if (tabData.fileType === 'MAP') {
                    const d = new CheckInDataMap(fileTypeToDisplayName(tabData.fileType));
                    d.rows = (t.data as EntityInformation).mapData.rows;
                    d.mapDescription = (t.data as EntityInformation).oipaRule.ruleName;
                    d.isNew = (t.data as EntityInformation).status.versionNumber === 0;
                    checkInData.push(d);
                } else if (tabData.fileType === 'SEQUENCE') {
                    const c = new CheckInDataSequence(fileTypeToDisplayName(tabData.fileType));
                    c.sequences = (t.data as EntityInformation).sequences;
                    checkInData.push(c);
                } else if (tabData.fileType === 'GROUP') {
                    const g = new CheckInGroup(fileTypeToDisplayName(tabData.fileType));
                    g.criteria = (t.data as EntityInformation).criteria;
                    checkInData.push(g);
                } else if (tabData.fileType === 'WORKFLOW_QUEUE_ROLE') {
                    const w = new CheckInWorkflowQueueRole(fileTypeToDisplayName(tabData.fileType));
                    w.workflowQueueRoles = (t.data as EntityInformation).workflowQueueRoles;
                    checkInData.push(w);
                } else if (tabData.fileType === 'PLAN_STATE_APPROVAL') {
                    const p = new CheckInPlanStateApproval(fileTypeToDisplayName(tabData.fileType));
                    p.planStateApprovals = (t.data as EntityInformation).planStateApprovals;
                    checkInData.push(p);
                } else {
                    // it's a XML file
                    const d = new CheckInDataString(fileTypeToDisplayName(tabData.fileType));
                    // data should be in top editor most of the time, otherwise change index with the correct model
                    d.fileData = t.model[0]?.getValue() ?? tabData.dataString;
                    checkInData.push(d);
                }
                return checkInData;
            })
            .flat();
    }
    return request;
};
