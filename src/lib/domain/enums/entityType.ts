export type EntityType =
    | 'ACTIVITY'
    | 'AGREEMENT'
    | 'AS_FILE'
    | 'ATTACHED_RULES'
    | 'APPLICATION'
    | 'BUSINESS_RULES'
    | 'BENEFIT_FUNDS'
    | 'CALCULATE'
    | 'CHILD_FUNDS'
    | 'CLIENT'
    | 'CODE'
    | 'COMPANY'
    | 'COMPUTATION'
    | 'COPYBOOKS'
    | 'COUNTRY'
    | 'CURRENCY'
    | 'CHART_OF_ACCOUNTS_ENTRY'
    | 'DATA_FILE'
    | 'DATA_MODEL'
    | 'DOCUMENT'
    | 'ELIGIBLE_TRANSACTION'
    | 'ERROR_CATALOG'
    | 'EXPOSED_COMPUTATION'
    | 'FILEOUTPUT'
    | 'FILTER'
    | 'FUNCTIONS'
    | 'FUND'
    | 'FUNDRELATIONS'
    | 'INTAKE'
    | 'INQUIRY_SCREEN'
    | 'LATERAL_FUNDS'
    | 'MAP'
    | 'MARKET'
    | 'MASKS'
    | 'MIGRATION_SET'
    | 'MULTIFIELDS'
    | 'OVERRIDE'
    | 'PACKAGE'
    | 'PLAN'
    | 'PLANFUND'
    | 'PLANFUNDSTATUS'
    | 'PLAN_PROGRAM_DEFINITION'
    | 'PRODUCT'
    | 'PROGRAM_DEFINITION'
    | 'POLICY'
    | 'POLICY_VALUE'
    | 'RATE'
    | 'REQUIREMENT'
    | 'REQUIREMENT_GROUP'
    | 'SCREEN'
    | 'SECURITY_GROUP'
    | 'SEGMENT_NAME'
    | 'SEGMENT_PROGRAM_DEFINITION'
    | 'SEQUENCE'
    | 'SQL_SCRIPT'
    | 'SYSTEM'
    | 'SYSTEM_DATE'
    | 'TRANSACTIONS'
    | 'USER_DEFINED'
    | 'WIDGET'
    | 'WORKFLOW'
    | 'WORKFLOW_DEFINITION'
    | 'WORKFLOW_QUEUE_ROLE'
    | 'OIPA_USER'
    | 'TRANSLATION'
    | 'FUNCTIONAL_TEST_SUITE'
    | 'LOG_HISTORY'
    | 'TRANSACTION_PROCESS'
    | '';

// TODO: determine others
export const entityIsEditor = (e: EntityType) => {
    return (
        e === 'AS_FILE' ||
        e === 'BUSINESS_RULES' ||
        e === 'INQUIRY_SCREEN' ||
        e === 'SEGMENT_NAME' ||
        e === 'TRANSACTIONS' ||
        e === 'FILTER' ||
        e === 'REQUIREMENT' ||
        e === 'FILEOUTPUT' ||
        e === 'ATTACHED_RULES' ||
        e === 'COPYBOOKS' ||
        e === 'MULTIFIELDS'
    );
};

export const entityIsBr = (e: EntityType) => {
    return e === 'FUNCTIONS' || e === 'COPYBOOKS' || e === 'SCREEN' || e === 'MULTIFIELDS';
};

export const brToEntityType = (e: EntityType, typeCode?: string): EntityType => {
    if (e !== 'BUSINESS_RULES' || !typeCode) return e;
    switch (typeCode) {
        case 'System':
        case '01':
            return 'SYSTEM';
        case 'File':
        case '03':
            return 'AS_FILE';
        case 'CopyBook':
        case '04':
            return 'COPYBOOKS';
        case 'Function':
        case '05':
            return 'FUNCTIONS';
        case 'MultiFields':
        case '06':
            return 'MULTIFIELDS';
        case 'Screen':
        case '07':
            return 'SCREEN';
        case 'Exposed Computation':
        case '08':
            return 'EXPOSED_COMPUTATION';
        case 'Computation':
        case '09':
            return 'COMPUTATION';
        case 'Attached Rule':
        case '10':
        case '12':
            return 'ATTACHED_RULES';
        case 'Calculate':
        case '13':
            return 'CALCULATE';
        case 'Widget':
        case '15':
            return 'WIDGET';
        default:
            return e;
    }
};

export const toEntityType = (e: string, transformToBR?: boolean): EntityType => {
    const capped = e.toUpperCase() as EntityType;
    return transformToBR && entityIsBr(capped) ? 'BUSINESS_RULES' : capped;
};
