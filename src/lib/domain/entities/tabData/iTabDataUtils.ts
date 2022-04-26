import CategorySession from './categorySession';
import ConfigPackageSession from './configPackageSession';
import DataModelSession from './dataModelSession';
import EntityInformation from './entityInformation';
import FunctionalTestSession from './functionalTestSession';
import GenericDataFileSession from './genericDataFileSession';
import HistoryDocument from './historyDocument';
import InterpreterSession from './interpreterSession';
import MigrateReviewSession from './migrateReviewSession';
import MigrationHistorySession from './migrationHistorySession';
import MigrationSetSession from './migrationSetSession';
import SystemDateSession from './SystemDateSession';
import TestReport from './testReport';
import UserStatisticsData from './userStatisticsData';
import AdministrationUserSession from "./administrationUserSession";
import AdministrationUserGroupSession from "./administrationUserGroupSession";
import OipaUserSession from "./oipaUserSession";
import OipaEnvironmentSession from "./oipaEnvironmentSession";
import ReleaseReportsData from './releaseReportsData';
import SystemFileSession from "./systemFileSession";
import SqlQuerySession from "./sqlQuerySession";
import OIPASecurityGroupSession from './oipaSecurityGroupSession';
import TranslationSession from "./translationSession";
import FunctionalTestStepSession from "./functionalTestStepSession";
import FunctionalTestSuiteResultTabSession from "./functionalTestSuiteResultTabSession";
import FunctionalTestSuiteSession from "./functionalTestSuiteSession";
import ViewManifestSession from "./viewManifestSession";
import ViewLogReleaseReportSession from "./viewLogReleaseReportSession";
import GenericLogSession from "./genericLogSession";
import TransactionProcessSession from './transactionProcessSession';

export const subTypes = [
    { value: EntityInformation, name: 'EntityInformation' },
    { value: InterpreterSession, name: 'InterpreterSession' },
    { value: TestReport, name: 'TestReport' },
    { value: UserStatisticsData, name: 'UserStatistics' },
    { value: ReleaseReportsData, name: 'ReleaseReports' },
    { value: FunctionalTestSession, name: 'FunctionalTestSession' },
    { value: CategorySession, name: 'CategorySession' },
    { value: DataModelSession, name: 'DataModelSession' },
    { value: GenericDataFileSession, name: 'GenericDataFileSession' },
    { value: HistoryDocument, name: 'HistoryDocument' },
    { value: ConfigPackageSession, name: 'ConfigPackageSession' },
    { value: MigrationSetSession, name: 'MigrationSetSession' },
    { value: MigrateReviewSession, name: 'MigrateReviewSession' },
    { value: MigrationHistorySession, name: 'MigrationHistorySession' },
    { value: AdministrationUserSession, name : 'AdministrationUserSession'},
    { value: AdministrationUserGroupSession, name: 'AdministrationUserGroupSession'},
    { value: OipaUserSession, name: 'OipaUserSession'},
    { value: OIPASecurityGroupSession, name: 'OipaSecurityGroup'},
    { value: OipaEnvironmentSession, name: 'OipaEnvironmentSession'},
    { value: SystemFileSession, name: 'SystemFileSession'},
    { value: SqlQuerySession, name: 'SqlQuerySession'},
    { value: SystemDateSession, name: 'SystemDateSession'},
    { value: TranslationSession, name: 'TranslationSession'},
    { value: TransactionProcessSession, name: 'TransactionProcessSession'},
    { value: FunctionalTestStepSession, name: 'FunctionalTestStepSession'},
    { value: FunctionalTestSuiteResultTabSession, name: 'FunctionalTestSuiteResultTabSession'},
    { value: FunctionalTestSuiteSession, name: 'FunctionalTestSuiteSession'},
    { value: ViewManifestSession, name: 'ViewManifestSession'},
    { value: ViewLogReleaseReportSession, name: 'ViewLogReleaseReportSession'},
    { value: GenericLogSession, name: 'GenericLogSession'}
];
