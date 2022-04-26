import CategorySession from '../../../lib/domain/entities/tabData/categorySession';
import ConfigPackageSession from '../../../lib/domain/entities/tabData/configPackageSession';
import FunctionalTestSuiteResultTabSession from '../../../lib/domain/entities/tabData/functionalTestSuiteResultTabSession';
import FunctionalTestSuiteSession from '../../../lib/domain/entities/tabData/functionalTestSuiteSession';
import SqlQuerySession from '../../../lib/domain/entities/tabData/sqlQuerySession';
import SystemDateSession from '../../../lib/domain/entities/tabData/SystemDateSession';
import UserStatisticsData from '../../../lib/domain/entities/tabData/userStatisticsData';
import DataModelSession from '../../../lib/domain/entities/tabData/dataModelSession';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import FunctionalTestSession from '../../../lib/domain/entities/tabData/functionalTestSession';
import GenericAsFileSession from '../../../lib/domain/entities/tabData/genericDataFileSession';
import HistoryDocument from '../../../lib/domain/entities/tabData/historyDocument';
import InterpreterSession from '../../../lib/domain/entities/tabData/interpreterSession';
import { ITabData } from '../../../lib/domain/entities/tabData/iTabData';
import MigrateReviewSession from '../../../lib/domain/entities/tabData/migrateReviewSession';
import MigrationHistorySession from '../../../lib/domain/entities/tabData/migrationHistorySession';
import MigrationSetSession from '../../../lib/domain/entities/tabData/migrationSetSession';
import TestReport from '../../../lib/domain/entities/tabData/testReport';
import { fileTypeIsEditor } from '../../../lib/domain/enums/fileType';
import AdministrationUserSession from "../../../lib/domain/entities/tabData/administrationUserSession";
import AdministrationUserGroupSession from "../../../lib/domain/entities/tabData/administrationUserGroupSession";
import OipaUserSession from "../../../lib/domain/entities/tabData/oipaUserSession";
import TranslationSession from "../../../lib/domain/entities/tabData/translationSession";
import OipaEnvironmentSession from "../../../lib/domain/entities/tabData/oipaEnvironmentSession";
import MigrationPathSession from "../../../lib/domain/entities/tabData/migrationPathSession";
import ReleaseReportsData from '../../../lib/domain/entities/tabData/releaseReportsData';
import SystemFileSession from "../../../lib/domain/entities/tabData/systemFileSession";
import OIPASecurityGroupSession from '../../../lib/domain/entities/tabData/oipaSecurityGroupSession';
import FunctionalTestStepSession from "../../../lib/domain/entities/tabData/functionalTestStepSession";
import ViewManifestSession from "../../../lib/domain/entities/tabData/viewManifestSession";
import ViewLogReleaseReportSession from "../../../lib/domain/entities/tabData/viewLogReleaseReportSession";
import GenericLogSession from "../../../lib/domain/entities/tabData/genericLogSession";
import TransactionProcessSession from '../../../lib/domain/entities/tabData/transactionProcessSession';

export type TabType =
    | 'Editor'
    | 'UserStatistics'
    | 'Code'
    | 'Map'
    | 'Error-Catalog'
    | 'Country'
    | 'Sequence'
    | 'Currency'
    | 'Unit-Test-Report'
    | 'ReleaseReports'
    | 'Functional-Test-Session'
    | 'Functional-Test-Suite-Session'
    | 'Interpreter'
    | 'History'
    | 'Category-Session'
    | 'DataModel-Session'
    | 'GenericXml-Session'
    | 'Config-Package-Session'
    | 'Migration-Set-Session'
    | 'Migrate-Review-Session'
    | 'Migration-History'
    | 'Group'
    | 'Workflow-Queue-Role'
    | 'Rate-Group'
    | 'Administration-User-Session'
    | 'Administration-User-Group-Session'
    | 'OIPA-User-Session'
    | 'OIPA-Security-Group'
    | 'Translation-Session'
    | 'TransactionProcess-Session'
    | 'Oipa-Environment-Session'
    | 'Migration-Path-Session'
    | 'SQL-Query-Session'
    | 'Plan-State-Approval'
    | 'MarketMaker'
    | 'System-File-Session'
    | 'System-Date-Session'
    | 'Functional-Test-Step-Session'
    | 'Functional-Test-Suite-Result-Session'
    | 'View-Manifest-Session'
    | 'View-Log-Release-Report-Session'
    | 'Generic-Log-Session'
    | 'Unknown';

export const determineTabTypeFromData = (data: ITabData): TabType => {
    if (data instanceof EntityInformation) {
        if (fileTypeIsEditor(data.fileType)) {
            return 'Editor';
        }
        switch (data.fileType) {
            case 'CODE':
                return 'Code';
            case 'MAP':
                return 'Map';
            case 'ERROR_CATALOG':
                return 'Error-Catalog';
            case 'COUNTRY':
                return 'Country';
            case 'CURRENCY':
                return 'Currency';
            case 'SEQUENCE':
                return 'Sequence';
            case 'GROUP':
                return 'Group';
            case 'WORKFLOW_QUEUE_ROLE':
                return 'Workflow-Queue-Role';
            case 'RATE_GROUP':
                return 'Rate-Group';
            case 'PLAN_STATE_APPROVAL':
                return 'Plan-State-Approval';
            case 'MARKET_MAKER':
                return 'MarketMaker';
            default:
                return 'Unknown';
        }
    }
    if (data instanceof UserStatisticsData) {
        return 'UserStatistics';
    }

    if (data instanceof FunctionalTestSession) {
        return 'Functional-Test-Session';
    }

    if (data instanceof FunctionalTestSuiteSession) {
        return 'Functional-Test-Suite-Session';
    }

    if(data instanceof FunctionalTestSuiteResultTabSession) {
        return 'Functional-Test-Suite-Result-Session';
    }

    if (data instanceof TestReport) {
        return 'Unit-Test-Report';
    }

    if (data instanceof InterpreterSession) {
        return 'Interpreter';
    }

    if (data instanceof ReleaseReportsData) {
        return 'ReleaseReports';
    }

    if (data instanceof HistoryDocument) {
        return 'History';
    }

    if (data instanceof CategorySession) {
        return 'Category-Session';
    }

    if (data instanceof DataModelSession) {
        return 'DataModel-Session';
    }

    if (data instanceof GenericAsFileSession) {
        return 'GenericXml-Session';
    }

    if (data instanceof ConfigPackageSession) {
        return 'Config-Package-Session';
    }

    if (data instanceof MigrationSetSession) {
        return 'Migration-Set-Session';
    }

    if (data instanceof MigrateReviewSession) {
        return 'Migrate-Review-Session';
    }

    if (data instanceof MigrationHistorySession) {
        return 'Migration-History';
    }

    if (data instanceof AdministrationUserSession) {
        return 'Administration-User-Session';
    }

    if (data instanceof AdministrationUserGroupSession) {
        return 'Administration-User-Group-Session';
    }

    if (data instanceof OipaUserSession) {
        return 'OIPA-User-Session';
    }

    if (data instanceof OIPASecurityGroupSession) {
        return 'OIPA-Security-Group';
    }

    if (data instanceof TranslationSession) {
        return 'Translation-Session';
    }

    if (data instanceof TransactionProcessSession) {
        return 'TransactionProcess-Session';
    }

    if (data instanceof OipaEnvironmentSession) {
        return 'Oipa-Environment-Session';
    }

    if (data instanceof MigrationPathSession) {
        return 'Migration-Path-Session';
    }

    if (data instanceof SqlQuerySession) {
        return 'SQL-Query-Session';
    }

    if (data instanceof SystemFileSession) {
        return 'System-File-Session';
    }

    if(data instanceof SystemDateSession) {
        return 'System-Date-Session';
    }

    if (data instanceof FunctionalTestStepSession) {
        return 'Functional-Test-Step-Session';
    }

    if (data instanceof ViewManifestSession) {
        return 'View-Manifest-Session';
    }

    if (data instanceof ViewLogReleaseReportSession) {
        return 'View-Log-Release-Report-Session';
    }

    if (data instanceof  GenericLogSession) {
        return 'Generic-Log-Session';
    }

    return 'Unknown';
};
