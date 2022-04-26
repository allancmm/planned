const OtherFile = <const>[
    { name: 'TRANSLATION', value: 'Translation' },
    { name: 'SECURITY_DATA', value: 'SecurityData' },
    { name: 'MAP', value: 'Map' },
    { name: 'CODE', value: 'Code' },
    { name: 'COUNTRY', value: 'Country' },
    { name: 'CURRENCY', value: 'Currency' },
    { name: 'SEQUENCE', value: 'Sequence' },
    { name: 'SYSTEM_DATE', value: 'SystemDate'},
    { name: 'ERROR_CATALOG', value: 'ErrorCatalog' },
    { name: 'FORM', value: 'Form' },
    { name: 'GROUP', value: 'Group' },
    { name: 'WORKFLOW_QUEUE_ROLE', value: 'WorkflowQueueRole' },
    { name: 'RATE_GROUP', value: 'RateGroup'},
    { name: 'PLAN_FUND_STATUS', value: 'PlanFundStatus'},
    { name: 'ENTITY_FIELD', value: 'EntityField'},
    { name: 'FUND_FIELD', value: 'FundField'},
    { name: 'METADATA', value: 'Metadata' },
    { name: 'PLAN_STATE_APPROVAL', value: 'PlanStateApproval' },
    { name: 'CHART_ACCOUNT_CRITERIA', value: 'ChartAccountCriterias' },
    { name: 'CHART_ACCOUNT_RESULT', value: 'ChartAccountResult' },
    { name: 'CHART_ACCOUNT_MONEY_TYPE', value: 'ChartAccountMoneyType' },
    { name: 'MARKET_MAKER', value: 'MarketMaker' },
    { name: 'DEFAULT', value: '' },
];
const EditorFile = <const>[
    { name: 'XSLT', value: 'XSLT' },
    { name: 'XML_DATA', value: 'XMLData' },
    { name: 'XML_DEFINITION', value: 'XMLDefinition' },
    { name: 'XML_SCHEMA', value: 'XMLSchema' },
    { name: 'PLAN_SEGMENT_DEFINITION', value: 'PlanSegmentDefinition' },
    { name: 'FILE_DEFINITION_XML', value: 'FileDefinitionXML' },
    { name: 'RECORD_DEFINITION_XML', value: 'RecordDefinitionXML' },
    { name: 'RECORD_XMLSCHEMA', value: 'RecordXMLSchema' },
    { name: 'RECORD_XSLT', value: 'RecordXSLT' },
    { name: 'RULE_XML', value: 'RuleXML' },
    { name: 'XML_RESULT', value: 'XMLResult' },
    { name: 'DATA', value: 'Data' },
    { name: 'SECURITY_DATA', value: 'SecurityData' },
    { name: 'SQL_DATA', value: 'SQLData' },
    { name: 'COPYBOOK_DATA', value: 'CopyBookData'},
];

type OtherFileType = typeof OtherFile[number]['name'];
type EditorFileType = typeof EditorFile[number]['name'];

export type FileType = EditorFileType | OtherFileType;
export const fileTypeIsEditor = (f: FileType): f is EditorFileType => {
    return !!EditorFile.find((e) => e.name === f);
};
export const fileTypeToDisplayName = (f: FileType) => {
    const tempFileTypes = [...OtherFile, ...EditorFile];
    return tempFileTypes.find((e) => e.name === f)?.value ?? '';
};
