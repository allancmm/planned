export const FolderType = [
    { name: 'PRIMARY_COMPANY', value: 'Primary Company' },
    { name: 'SECONDARY_COMPANY', value: 'Subsidiary Company' },
    { name: 'PRODUCT', value: 'Product' },
    { name: 'PLAN', value: 'Plan' },
    { name: 'TRANSACTION', value: 'Transaction' },
    { name: 'FUND', value: 'Fund' },

    { name: 'PROGRAM_DEFINITION', value: 'Program Definition' },
    { name: 'BUSINESS_RULE', value: 'Business Rule' },
    { name: 'AGREEMENT', value: 'Agreement Definition' },
    { name: 'CLIENT', value: 'Client' },
    { name: 'EXPOSED_COMPUTATION', value: 'Exposed Computation' },
    { name: 'FILE', value: 'File' },
    { name: 'FILE_OUTPUT', value: 'File Output' },
    { name: 'INQUIRY_SCREEN', value: 'Inquiry Screen' },
    { name: 'INTAKE_PROFILE', value: 'Intake Profile Definition' },
    { name: 'MAP_GROUP', value: 'Map' },
    { name: 'RATE_GROUP', value: 'Rate' },
    { name: 'REQUIREMENT_DEFINITION', value: 'Requirement Definition' },
    { name: 'REQUIREMENT_GROUP', value: 'Requirement Group' },
    { name: 'SEGMENT_NAME', value: 'Segment Name' },
    { name: 'CODE', value: 'Code' },
    { name: 'ROLE', value: 'Role' },
    { name: 'FILTER', value: 'Activity Filters' },
    { name: 'COMMENTS_TEMPLATE', value: 'Comment Templates' },
    { name: 'SEGMENT_PROGRAM_DEFINITION', value: 'Segment Program Definition' },
    { name: 'PLAN_PROGRAM_DEFINITION', value: 'Plan Program Definition' },
    { name: 'PLAN_STATE_APPROVAL', value: 'Plan State Approval' },


    { name: 'PLAN_FUND', value: 'Plan Fund' },
    { name: 'FUND_RELATION', value: 'Fund Relation' },
    { name: 'CHILD_FUND', value: 'Child Fund' },
    { name: 'BENEFIT_FUND', value: 'Benefit Fund' },
    { name: 'LATERAL_FUND', value: 'Lateral Fund' },
    { name: 'PRODUCT_FUND', value: 'Product Fund' },
    { name: 'QUOTE_DEFINITION', value: 'Quote Definition' },

    { name: 'COUNTRY', value: 'Country' },
    { name: 'CURRENCY', value: 'Currency' },
    { name: 'MARKET_MAKER', value: 'Market Maker' },
    { name: 'ERRORCATALOG', value: 'Error Catalog' },
    { name: 'MASK', value: 'Masks' },
    { name: 'TRANSLATION', value: 'Translation' },
    { name: 'WORKFLOWQUEUEROLE', value: 'Workflow Queue Role' },
    { name: 'BATCH_SCREENS', value: 'Batch Screens' },
    { name: 'DATA_FILE', value: 'Data File' },
    { name: 'SQL_SCRIPT', value: 'SQL Scripts'},
    { name: 'CHART_OF_ACCOUNTS', value: 'Chart Of Accounts' },
    { name: 'CHART_OF_ACCOUNTS_ENTITY', value: 'Entity' },
] as const;

export type FolderTypes = typeof FolderType[number]['name'];

export const getFolderType = (f: FolderTypes) =>
    FolderType.find((ft) => ft.name === f);

