import React from 'react';
import {
    ActivityBadge,
    ActivityFilterBadge,
    AgreementDefinitionBadge,
    AsFileBadge,
    AsFileOutputBadge,
    BasicBadge,
    BatchScreenBadge,
    BusinessRulesBadge,
    CodeBadge,
    CommentsTemplateBadge,
    CompanyBadge,
    CompanyPrimaryBadge,
    CompanySubBadge,
    CountryBadge,
    CurrencyBadge,
    DataFileBadge,
    ErrorCatalogBadge,
    ExposedComputationBadge,
    FundBadge,
    InquiryScreenBadge,
    IntakeProfileDefinitionBadge,
    MapBadge,
    MaskBadge,
    PlanBadge,
    PlanProgramDefinitionBadge,
    PlanStateApprovalBadge,
    ProductBadge,
    ProgramDefinitionBadge,
    QuoteDefinitionBadge,
    RateBadge,
    RequirementDefinitionBadge,
    RequirementGroupBadge,
    SegmentNameBadge,
    SegmentProgramDefinitionBadge,
    SequenceBadge,
    SqlBadge,
    TransactionBadge,
    WorkflowTaskDefinitionRoleBadge,
    AccountChartBadge,
    AdmUserGroupBadge,
    AdmUserBadge,
    OipaEnvironmentBadge,
    MigrationPathBadge,
    OipaSecurityGroupBadge,
    UnitTestBadge, PackageBadge, MigrationSetBadge,
    GlobalBadge,
    OipaUserBadge, SystemFileBadge, TranslationBadge, AccountChartEntityBadge, AccountChartEntryBadge,
    UnitTestReportBadge, FunctionTestBadge, FunctionalTestStepBadge, FunctionalTestSuiteBadge,
    FunctionalTestSuiteResultBadge, ViewManifestBadge, ViewLogReleaseReportBadge, TransactionProcessBadge,
} from './style';

interface TypeBadgeProps {
    type: string;
    fallback?: string;
}

const TypeBadge = ({ type, fallback, ...props }: TypeBadgeProps & React.HTMLAttributes<HTMLDivElement>) => {
    switch (type) {
        case 'TRANSACTION':
        case 'TRANSACTIONS':
            return <TransactionBadge title='Transaction' {...props} />;
        case 'ACTIVITY':
            return <ActivityBadge title='Activity' {...props} />;
        case 'BUSINESS_RULES':
        case 'BUSINESS RULE':
            return <BusinessRulesBadge title='Business Rule' {...props} />;
        case 'SEGMENT_NAME':
            return <SegmentNameBadge title='Segment Name' {...props} />;
        case 'AS_FILE':
            return <AsFileBadge title='File' {...props} />;
        case 'FILEOUTPUT':
            return <AsFileOutputBadge title='File Output' {...props} />;
        case 'AGREEMENT':
            return <AgreementDefinitionBadge title='Agreement Definition' {...props} />;
        case 'INQUIRY_SCREEN':
            return <InquiryScreenBadge title='Inquiry Screen' {...props} />;
        case 'MASKS':
            return <MaskBadge title='Mask' {...props} />;
        case 'REQUIREMENT':
        case 'REQUIREMENT_DEFINITION':
            return <RequirementDefinitionBadge title='Requirement Definition' {...props} />;
        case 'REQUIREMENT_GROUP':
            return <RequirementGroupBadge title='Requirement Group' {...props} />;
        case 'QUOTE':
            return <QuoteDefinitionBadge title='Quote Definition' {...props} />;
        case 'INTAKE':
            return <IntakeProfileDefinitionBadge title='Intake Profile Definition' {...props} />;
        case 'EXPOSED_COMPUTATION':
        case 'EXPOSED COMPUTATION':
            return <ExposedComputationBadge title='Exposed Computation' {...props} />;
        case 'RATE':
            return <RateBadge title='Rate' {...props} />;
        case 'MAP':
            return <MapBadge title='Map' {...props} />;
        case 'CODE':
            return <CodeBadge title='Code' {...props} />;
        case 'COMPANY':
            return <CompanyBadge title='Company' {...props} />;
        case 'PLAN':
            return <PlanBadge title='Plan' {...props} />;
        case 'PRODUCT':
            return <ProductBadge title='Product' {...props} />;
        case 'PROGRAM_DEFINITION':
            return <ProgramDefinitionBadge title='Program Definition' {...props} />;
        case 'SEGMENT_PROGRAM_DEFINITION':
            return <SegmentProgramDefinitionBadge title='Segment Program Definition' {...props} />;
        case 'PLAN_PROGRAM_DEFINITION':
            return <PlanProgramDefinitionBadge title='Plan Program Definition' {...props} />;
        case 'PLAN_STATE_APPROVAL':
            return <PlanStateApprovalBadge title='Plan State Approval' {...props} />;
        case 'QUOTE_DEFINITION':
            return <QuoteDefinitionBadge title='Quote Definition' {...props} />;
        case 'WORKFLOW':
            return <WorkflowTaskDefinitionRoleBadge title='Workflow' {...props} />;
        case 'FILTER':
            return <ActivityFilterBadge title='Filter' {...props} />;
        case 'COMMENTS_TEMPLATE':
            return <CommentsTemplateBadge {...props} />;
        case 'BATCH_SCREENS':
            return <BatchScreenBadge title='Batch Screens' {...props} />;
        case 'PRIMARY_COMPANY':
            return <CompanyPrimaryBadge title='Primary Company' {...props} />;
        case 'SECONDARY_COMPANY':
            return <CompanySubBadge title='Subsidiary Company' {...props} />;
        case 'FUND':
            return <FundBadge title='Fund' {...props} />;
        case 'SQL_SCRIPT':
        case 'SQL-Query-Session':
            return <SqlBadge title='SQL Query' {...props} />
        case 'CHART_OF_ACCOUNTS':
            return <AccountChartBadge title='Chart of Accounts' {...props} />;
        case 'CHART_OF_ACCOUNTS_ENTITY':
            return <AccountChartEntityBadge title='Chart of Account Entity' {...props} />;
        case 'CHART_OF_ACCOUNTS_ENTRY':
            return <AccountChartEntryBadge title='Chart of Accounts Entry' {...props} />;
        case 'CURRENCY':
            return <CurrencyBadge title='Currency' {...props} />;
        case 'COUNTRY':
            return <CountryBadge title='Country' {...props} />;
        case 'ERROR_CATALOG':
            return <ErrorCatalogBadge title='Error Catalog' {...props} />;
        case 'SEQUENCE':
            return <SequenceBadge title='Sequence' {...props} />;
        case 'DATA_FILE':
            return <DataFileBadge title='Data File' {...props} />;
        case 'Dashboard':
            return <BasicBadge title='Dashboard' {...props}>D</BasicBadge>;
        case 'UserStatistics':
            return <BasicBadge title='User Statistics' {...props}>US</BasicBadge>;
        case 'ReleaseReports':
            return <BasicBadge title='Release Report' {...props}>RR</BasicBadge>;
        case 'Interpreter':
            return <BasicBadge title='Interpreter' {...props}>int</BasicBadge>;
        case 'Functional-Test-Session':
            return <FunctionTestBadge title='Functional Test' {...props} />
        case 'Functional-Test-Suite-Session':
            return <FunctionalTestSuiteBadge {...props} />
        case 'Category-Session':
            return <BasicBadge title='Category' {...props}>ddc</BasicBadge>;
        case 'DataModel-Session':
            return <BasicBadge title='Data Model' {...props}>ddl</BasicBadge>;
        case 'GenericXml-Session':
            return <DataFileBadge title='Generic Xml' {...props} />;
        case 'MIGRATION_SET':
            return <MigrationSetBadge title='Migration Set' {...props} />;
        case 'Migrate-Review-Session':
            return <MigrationSetBadge title='Migration Review' text="'mr'" {...props} />
        case 'Migration-History':
            return <MigrationSetBadge title='Migration Review' text="'mh'" {...props} />
        case 'PACKAGE':
            return <PackageBadge title='Package' {...props}/>;
        case 'Config-Package-Session':
            return <PackageBadge title='Configuration Package' {...props} />;
        case 'Global':
            return <GlobalBadge title='Global' {...props} />;
        case 'OIPA-User-Session':
            return <OipaUserBadge title='OIPA User' {...props} />;
        case 'System-File-Session':
            return <SystemFileBadge title='System File' {...props} />;
        case 'Translation-Session':
            return <TranslationBadge title='Translation' {...props} />
        case 'TransactionProcess-Session':
            return <TransactionProcessBadge title='Transaction Processing Order' {...props} />
        case 'Administration-User-Group-Session':
             return <AdmUserGroupBadge title='Administration User Group' {...props} />
        case 'Administration-User-Session':
             return <AdmUserBadge title='Administration User' {...props} />;
        case 'Oipa-Environment-Session':
            return <OipaEnvironmentBadge title='OIPA Environment' {...props} />
        case 'Migration-Path-Session':
            return <MigrationPathBadge title='Migration Path'  {...props} />;
        case 'OIPA-Security-Group':
            return <OipaSecurityGroupBadge title='OIPA Security Group' {...props} />;
        case 'Unit-Test-Report':
            return <UnitTestReportBadge title='Unit Test Report' />;
        case 'UNIT_TEST':
            return <UnitTestBadge title='Unit Test' {...props} />;
        case 'Functional-Test-Step-Session':
            return <FunctionalTestStepBadge />;
        case 'Functional-Test-Suite-Result-Session':
            return <FunctionalTestSuiteResultBadge {...props} />
        case 'View-Manifest-Session':
            return <ViewManifestBadge {...props} />
        case 'View-Log-Release-Report-Session':
            return <ViewLogReleaseReportBadge {...props} />;
        case 'Migration-Set-Session':
            return <MigrationSetBadge title='Migration Set' {...props} />;
        case 'Generic-Log-Session':
            return <BasicBadge {...props}>log</BasicBadge>
        case '[Bad GUID]':
            return <BasicBadge {...props}>?</BasicBadge>;
        default:
            return type.startsWith('Global') ? <BasicBadge {...props} /> :
                fallback ? <TypeBadge type={fallback} {...props} /> : <BasicBadge {...props}>{type}</BasicBadge>;
    }
};

export default TypeBadge;
