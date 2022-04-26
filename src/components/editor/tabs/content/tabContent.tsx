import { Loading } from 'equisoft-design-ui-elements';
import React from 'react';
import ErrorBoundary from '../../../general/error/errorBoundary';
import { useTabWithId } from '../tabContext';

interface TabContentProps {
    tabId: string;
    layoutId: number;
}

const Editor = React.lazy(() => import(/* webpackChunkName: "monaco" */ '../../../../containers/editor/editor'));
const Interpreter = React.lazy(
    () => import(/* webpackChunkName: "Interpreter" */ '../../../../containers/editor/interpreter/interpreter'),
);
const UserStatistics = React.lazy(
    () => import(/* webpackChunkName: "UserStatistics" */ '../../../../containers/userStatistics'),
);
const ReleaseReports = React.lazy(
    () => import(/* webpackChunkName: "ReleaseReports" */ '../../../../containers/releaseReport'),
);

const FunctionalTest = React.lazy(
    () => import(/* webpackChunkName: "FunctionalTest" */ '../../../../containers/editor/functionalTestTab'),
);
const FunctionalTestSuite = React.lazy(
    () => import(/* webpackChunkName: "FunctionalTestSuite" */ '../../../../containers/editor/functionalTestSuiteTab'),
);

const FunctionalTestSuiteResultTab = React.lazy(
    () =>
        import(
            /* webpackChunkName: "FunctionalTestSuiteResultTab" */ '../../../../containers/editor/functionalTestSuiteResultTab'
        ),
);
const Maps = React.lazy(() => import(/* webpackChunkName: "Maps" */ '../../../../containers/editor/map'));
const Codes = React.lazy(() => import(/* webpackChunkName: "Codes" */ '../../../../containers/editor/code'));
const ErrorCatalogs = React.lazy(
    () => import(/* webpackChunkName: "ErrorCatalogs" */ '../../../../containers/editor/errorCatalog'),
);
const Countries = React.lazy(() => import(/* webpackChunkName: "Countries" */ '../../../../containers/editor/country'));
const Currencies = React.lazy(
    () => import(/* webpackChunkName: "Currencies" */ '../../../../containers/editor/currency'),
);
const MarketMakers = React.lazy(
    () => import(/* webpackChunkName: "MarketMakers" */ '../../../../containers/editor/marketMaker'),
);
const Sequences = React.lazy(
    () => import(/* webpackChunkName: "Sequences" */ '../../../../containers/editor/sequence'),
);

const History = React.lazy(() => import(/* webpackChunkName: "History" */ '../../../../containers/editor/history'));
const ConfigPackageTab = React.lazy(
    () => import(/* webpackChunkName: "ConfigPackage" */ '../../../../containers/editor/configPackageTab'),
);
const MigrationSetContent = React.lazy(
    () =>
        import(
            /* webpackChunkName: "MigrationSetContent" */ '../../../../containers/migrationSets/migrationSetContent'
        ),
);

const TestResultViewer = React.lazy(
    () => import(/* webpackChunkName: "TestResultViewer" */ '../../../../containers/testResultViewer'),
);

const DataCategory = React.lazy(
    () =>
        import(
            /* webpackChunkName: "DataCategory" */ '../../../../containers/dataManagement/dataDictionary/dataCategoryTab'
        ),
);

const DataModel = React.lazy(
    () =>
        import(/* webpackChunkName: "DataModel" */ '../../../../containers/dataManagement/dataDictionary/dataModelTab'),
);

const GenericXml = React.lazy(
    () =>
        import(
            /* webpackChunkName: "GenericXml" */ '../../../../containers/dataManagement/genericDataFile/genericXmlTab'
        ),
);

const MigrateMigrationSet = React.lazy(
    () =>
        import(
            /* webpackChunkName: "MigrateMigrationSet" */ '../../../../containers/migrationSets/migrateMigrationSet'
        ),
);

const MigrationHistoryDocument = React.lazy(
    () =>
        import(
            /* webpackChunkName: "MigrationHistoryDocument" */ '../../../../containers/migrationSets/migrationHistory/index'
        ),
);

const RequirementGroup = React.lazy(
    () => import(/* webpackChunkName: "Group" */ '../../../../containers/editor/requirementGroup'),
);

const WorkflowQueueRole = React.lazy(
    () => import(/* webpackChunkName: "WorkflowQueueRole" */ '../../../../containers/editor/workflowQueueRole'),
);

const RateGroup = React.lazy(
    () => import(/* webpackChunkName: "RateGroup" */ '../../../../containers/editor/rateGroup'),
);

const AdministrationUserContent = React.lazy(
    () => import('../../../../containers/administration/administrationUserContent'),
);

const AdministrationUserGroupContent = React.lazy(
    () => import('../../../../containers/administration/administrationUserGroupContent'),
);

const OipaUserContent = React.lazy(() => import('../../../../containers/administration/oipaUserContent'));

const OipaSecurityContent = React.lazy(() => import('../../../../containers/administration/securityGroup'));

const Translations = React.lazy(() => import('../../../../containers/editor/translations'));

const TransactionProcess = React.lazy(() => import('../../../../containers/editor/transactionsProcess'));

const OipaEnvironmentContent = React.lazy(() => import('../../../../containers/administration/oipaEnvironmentContent'));

const SqlQuery = React.lazy(() => import('../../../../containers/editor/sqlQuery'));

const MigrationPathContent = React.lazy(() => import('../../../../containers/administration/migrationPathContent'));

const SystemFile = React.lazy(
    () => import(/* webpackChunkName: "SystemFile" */ '../../../../containers/editor/systemFile'),
);

const SystemDateCatalog = React.lazy(() => import('../../../../containers/editor/systemDateCatalog'));

const PlanStateApproval = React.lazy(() => import('../../../../containers/editor/planStateApproval'));
const FunctionalTestStep = React.lazy(() => import('../../../../containers/editor/functionalTestStep'));
const ViewManifest = React.lazy(() => import('../../../../containers/editor/viewManifest'));
const ViewLogReleaseReport = React.lazy(() => import('../../../../containers/editor/viewLogReleaseReport'));
const GenericLog = React.lazy(() => import('../../../../containers/editor/genericLog'));

const TabContent = ({ tabId, layoutId }: TabContentProps) => {
    const { tabType } = useTabWithId(tabId);

    switch (tabType) {
        case 'Editor':
            return <Editor tabId={tabId} layoutId={layoutId} />;
        case 'UserStatistics':
            return <UserStatistics tabId={tabId} />;
        case 'ReleaseReports':
            return <ReleaseReports tabId={tabId} />;
        case 'Map':
            return <Maps tabId={tabId} />;
        case 'Code':
            return <Codes tabId={tabId} />;
        case 'Error-Catalog':
            return <ErrorCatalogs tabId={tabId} />;
        case 'Country':
            return <Countries tabId={tabId} />;
        case 'Currency':
            return <Currencies tabId={tabId} />;
        case 'MarketMaker':
            return <MarketMakers tabId={tabId} />;
        case 'Sequence':
            return <Sequences tabId={tabId} />;
        case 'Unit-Test-Report':
            return <TestResultViewer tabId={tabId} />;
        case 'Functional-Test-Session':
            return <FunctionalTest tabId={tabId} layoutId={layoutId} />;
        case 'Functional-Test-Suite-Session':
            return <FunctionalTestSuite tabId={tabId} layoutId={layoutId} />;
        case 'Interpreter':
            return <Interpreter tabId={tabId} layoutId={layoutId} />;
        case 'History':
            return <History tabId={tabId} layoutId={layoutId} />;
        case 'Category-Session':
            return <DataCategory tabId={tabId} layoutId={layoutId} />;
        case 'DataModel-Session':
            return <DataModel tabId={tabId} layoutId={layoutId} />;
        case 'GenericXml-Session':
            return <GenericXml tabId={tabId} layoutId={layoutId} />;
        case 'Config-Package-Session':
            return <ConfigPackageTab tabId={tabId} layoutId={layoutId} />;
        case 'Migration-Set-Session':
            return <MigrationSetContent tabId={tabId} layoutId={layoutId} />;
        case 'Migrate-Review-Session':
            return <MigrateMigrationSet tabId={tabId} />;
        case 'Migration-History':
            return <MigrationHistoryDocument tabId={tabId} />;
        case 'Group':
            return <RequirementGroup tabId={tabId} />;
        case 'Workflow-Queue-Role':
            return <WorkflowQueueRole tabId={tabId} />;
        case 'Rate-Group':
            return <RateGroup tabId={tabId} />;
        case 'Administration-User-Session':
            return <AdministrationUserContent tabId={tabId} layoutId={layoutId} />;
        case 'Administration-User-Group-Session':
            return <AdministrationUserGroupContent tabId={tabId} />;
        case 'OIPA-User-Session':
            return <OipaUserContent tabId={tabId} />;
        case 'OIPA-Security-Group':
            return <OipaSecurityContent tabId={tabId} />;
        case 'Translation-Session':
            return <Translations tabId={tabId} />;
        case 'TransactionProcess-Session':
            return <TransactionProcess tabId={tabId} />;
        case 'Oipa-Environment-Session':
            return <OipaEnvironmentContent tabId={tabId} />;
        case 'Migration-Path-Session':
            return <MigrationPathContent tabId={tabId} layoutId={layoutId} />;
        case 'SQL-Query-Session':
            return <SqlQuery tabId={tabId} layoutId={layoutId} />;
        case 'Plan-State-Approval':
            return <PlanStateApproval tabId={tabId} />;
        case 'System-File-Session':
            return <SystemFile tabId={tabId} layoutId={layoutId} />;
        case 'System-Date-Session':
            return <SystemDateCatalog tabId={tabId} />;
        case 'Functional-Test-Step-Session':
            return <FunctionalTestStep tabId={tabId} layoutId={layoutId} />;
        case 'Functional-Test-Suite-Result-Session':
            return <FunctionalTestSuiteResultTab tabId={tabId} />;
        case 'View-Manifest-Session':
            return <ViewManifest tabId={tabId} />;
        case 'View-Log-Release-Report-Session':
            return <ViewLogReleaseReport tabId={tabId} />;
        case 'Generic-Log-Session':
            return <GenericLog tabId={tabId} />;
        case 'Unknown':
            return <div>UNKNOWN TAB TYPE</div>;
    }
};

export default (props: any) => (
    <React.Suspense fallback={<Loading />}>
        <ErrorBoundary>
            <TabContent {...props} />
        </ErrorBoundary>
    </React.Suspense>
);
