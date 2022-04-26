import { Loading } from 'equisoft-design-ui-elements';
import React, { useContext } from 'react';
import ErrorBoundary from '../../error/errorBoundary';
import { RightbarContext } from '../rightbarContext';
import { CloseIcon, HeaderPanelContent, PanelContent } from '../style';

const EntityInfos = React.lazy(() =>
    import(/* webpackChunkName: "EntityInfos" */ '../../../editor/fileHeader/modal/info')
);

const CreateTestSuiteForm = React.lazy(() =>
    import(/* webpackChunkName: "CreateTestSuite" */ '../../../../containers/editor/unit-tests/createTestSuite')
);

const AddAttachedRules = React.lazy(() =>
    import(/* webpackChunkName: "AddAttachedRules" */ '../../../transactionTab/attachedRules')
);

const AddCriteria = React.lazy(() =>
    import(/* webpackChunkName: "AddCriteria" */ '../../../../containers/editor/map/addCriteria')
);

const GenerateXml = React.lazy(() =>
    import(/* webpackChunkName: "GenerateXml" */ '../../../../containers/editor/functionalTestTab/generateXml')
);

const BusinessRuleCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "BusinessRuleCreationWizard" */ '../../../../containers/entityCreation/businessRules')
);

const ExportDataDictionaryWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "ExportDataDictionaryWizard" */ '../../../../containers/entityCreation/exportDataDictionary'
    )
);

const AsFileCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "AsFileCreationWizard" */ '../../../../containers/entityCreation/asFile')
);

const FileOutputCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "FileOutputCreationWizard" */ '../../../../containers/entityCreation/fileOutput')
);

const ProductCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "ProductCreationWizard" */ '../../../../containers/entityCreation/product')
);

const ProgramDefinitionCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "ProgramDefinitionCreationWizard" */ '../../../../containers/entityCreation/program')
);

const PlanProgramDefinitionCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "PlanProgramDefinitionCreationWizard" */ '../../../../containers/entityCreation/planProgramDefinition')
);

const SegmentProgramDefinitionCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "SegmentProgramDefinitionCreationWizard" */ '../../../../containers/entityCreation/segmentProgramDefinition')
);

const CompanyCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "CompanyCreationWizard" */ '../../../../containers/entityCreation/company')
);

const TransactionCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "TransactionCreationWizard" */ '../../../../containers/entityCreation/transactions/')
);

const RequirementDefinitionCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "RequirementDefinitionCreationWizard" */ '../../../../containers/entityCreation/requirementDefinition'
    )
);

const RequirementGroupCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "RequirementGroupCreationWizard" */ '../../../../containers/entityCreation/requirementGroup'
    )
);

const QuoteDefinitionCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "QuoteDefinitionCreationWizard" */ '../../../../containers/entityCreation/quoteDefinition'
    )
);

const PlanCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "PlanCreationWizard" */ '../../../../containers/entityCreation/plan'
    )
);

const SegmentNameCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "SegmentNameCreationWizard"*/ '../../../../containers/entityCreation/segmentName')
);

const InquiryScreenCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "InquiryScreenCreationWizard"*/ '../../../../containers/entityCreation/inquiryScreen')
);

const BuildRelease = React.lazy(() =>
    import(/* webpackChunkName: "BuildRelease" */ '../../../../containers/packagingControl/buildRelease')
);

const DeployRelease = React.lazy(() =>
    import(/* webpackChunkName: "DeployRelease" */ '../../../../containers/packagingControl/deployRelease')
);

const ImportRatesWizard = React.lazy(() =>
    import(/* webpackChunkName: "ImportRatesWizard" */ '../../../editor/menu/tools/importRates')
);

const ExportRatesWizard = React.lazy(() =>
    import(/* webpackChunkName: "EmportRatesWizard" */ '../../../editor/menu/tools/exportRates')
);

const ImportMapsWizard = React.lazy(() =>
    import(/* webpackChunkName: "ImportMapsWizard" */ '../../../editor/menu/tools/importMaps')
);

const ExportMapsWizard = React.lazy(() =>
    import(/* webpackChunkName: "ImportMapsWizard" */ '../../../editor/menu/tools/exportMaps')
);

const ImportSecurityGroupsWizard = React.lazy(() =>
    import(/* webpackChunkName: "ImportSecurityGroupsWizard" */ '../../../editor/menu/tools/importSecurityGroups')
);

const ExportSecurityGroupsWizard = React.lazy(() =>
    import(/* webpackChunkName: "ExportSecurityGroupsWizard" */ '../../../editor/menu/tools/exportSecurityGroups')
);
const CodeCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "CodeCreationWizard"*/ '../../../../containers/entityCreation/codeName')
);

const MapCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "MapCreationWizard"*/ '../../../../containers/entityCreation/groupMap')
);

const FundCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "FundCreationWizard"*/ '../../../../containers/entityCreation/fund')
);

const PlanFundCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "PlanFundCreationWizard"*/ '../../../../containers/entityCreation/planFund')
);

const RelatedFundCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "RelatedFundCreationWizard"*/ '../../../../containers/entityCreation/relatedFund')
);

const AgreementDefinitionCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "AgreementDefinitionCreationWizard" */ '../../../../containers/entityCreation/agreement')
);


const ExposedComputationCreationWizard = React.lazy(() =>
    import(/* webpackChunkName: "ExposedComputationCreationWizard"*/ '../../../../containers/entityCreation/exposedComputation')
);

const SqlScriptCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "SqlScriptCreationWizard" */ '../../../../containers/entityCreation/sqlScript')
);

const IntakeProfileDefinitionCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "IntakeProfileDefinitionCreationWizard" */ '../../../../containers/entityCreation/intakeProfileDefinition')
);

const ConfigPackageReviewersWizard = React.lazy(() =>
    import(/* webpackChunkName: "ConfigPackageReviewersWizard" */ '../../../../components/configPackageTab/configPackageReviewers')
);

const MaskDetailCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "MaskDetailCreationWizard" */ '../../../../containers/entityCreation/maskDetails')
);

const ActivityFilterCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "ActivityFilterCreationWizard" */ '../../../../containers/entityCreation/activityFilter')
);

const SecurityGroupCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "SecurityGroupCreationWizard" */ '../../../../containers/entityCreation/securityGroup')
);

const BatchScreenCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "BatchScreenCreationWizard" */ '../../../../containers/entityCreation/batchScreen')
);

const CommentsTemplateCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "CommentsTemplateCreationWizard" */ '../../../../containers/entityCreation/commentsTemplate')
);


const WorkflowTaskDefinitionCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "WorkflowTaskDefinitionCreationWizard" */ '../../../../containers/entityCreation/workflowTaskDefinition')
);

const UserOipa = React.lazy(() => import(
    /* webpackChunkName: "UserOipa" */ '../../../../containers/entityCreation/userOipa')
);

const ChartAccountCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "ChartAccountCreationWizard" */ '../../../../containers/entityCreation/chart/account')
);

const EntityCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "EntityCreationWizard" */ '../../../../containers/entityCreation/chart/entity')
);

const EntryCreationWizard = React.lazy(() =>
    import(
        /* webpackChunkName: "EntryCreationWizard" */ '../../../../containers/entityCreation/chart/entry')
);

const EntityDuplication = React.lazy(() => import(
    /* webpackChunkName: "EntityDuplication" */ '../../../../containers/entityDuplication')
);

const SystemDateCreationWizard = React.lazy(() => import( '../../../../containers/entityCreation/systemDate'))
const ConfigPackage = React.lazy(() => import('../../../../containers/entityCreation/configPackage'));
const ConfigPackageComment = React.lazy(() => import('../../../../containers/entityCreation/configPackageComment'));

const EditMigrationSet = React.lazy(() => import('../../../../containers/entityCreation/editMigrationSet'));

const RightbarContent = () => {
    const { rightbarType, data, closeRightbar } = useContext(RightbarContext);

    return (
        <PanelContent>
            <HeaderPanelContent>
                <CloseIcon onClick={closeRightbar} />
            </HeaderPanelContent>

            {(() => {
                switch (rightbarType) {
                    case 'Info':
                        return <EntityInfos />;
                    case 'Create_Test_Suite':
                        return <CreateTestSuiteForm testData={data} />;
                    case 'Add_Attached_Rules':
                        return <AddAttachedRules ruleData={data}/>;
                    case 'Add_Map_Criteria':
                        return <AddCriteria tabId={data} />;
                    case 'Generate_Xml':
                        return <GenerateXml generateXmlData={data} />;
                    case 'Create_Rule_entity':
                        return <BusinessRuleCreationWizard extraData={data} />;
                    case 'Export_Data_Dictionary':
                        return <ExportDataDictionaryWizard />;
                    case 'Create_Transaction_Entity':
                        return <TransactionCreationWizard />;
                    case 'Create_Company':
                        return <CompanyCreationWizard />;
                    case 'Create_File_Entity':
                        return <AsFileCreationWizard />;
                    case 'Create_File_Output':
                        return <FileOutputCreationWizard />;
                    case 'Build_Release':
                        return <BuildRelease data={data} />;
                    case 'Deploy_Release':
                        return <DeployRelease release={data} />;
                    case 'Import_Maps':
                        return <ImportMapsWizard />;
                    case 'Export_Maps':
                        return <ExportMapsWizard />;
                    case 'Import_Security_Groups':
                        return <ImportSecurityGroupsWizard />;
                    case 'Export_Security_Groups':
                        return <ExportSecurityGroupsWizard />;
                    case 'Import_Rates':
                        return <ImportRatesWizard />;
                    case 'Export_Rates':
                        return <ExportRatesWizard />;
                    case 'Create_Plan':
                        return <PlanCreationWizard />;
                    case 'Create_Requirement':
                        return <RequirementDefinitionCreationWizard />;
                    case 'Create_RequirementGroup':
                        return <RequirementGroupCreationWizard />;
                    case 'Create_Quote':
                        return <QuoteDefinitionCreationWizard />;
                    case 'Create_Product':
                        return <ProductCreationWizard />;
                    case 'Create_Program':
                        return <ProgramDefinitionCreationWizard />;
                    case 'Create_Link_Plan_Program':
                        return <PlanProgramDefinitionCreationWizard />;
                    case 'Create_SegmentName':
                        return <SegmentNameCreationWizard />;
                    case 'Create_InquiryScreen':
                        return <InquiryScreenCreationWizard />;
                    case 'Create_Code':
                        return <CodeCreationWizard />;
                    case 'Create_Map':
                        return <MapCreationWizard />;
                    case 'Create_Fund':
                        return <FundCreationWizard />;
                    case 'Create_Plan_Fund':
                        return <PlanFundCreationWizard />;
                    case 'Create_Related_Fund':
                        return <RelatedFundCreationWizard />;
                    case 'Create_Agreement':
                        return <AgreementDefinitionCreationWizard />;
                    case 'Create_Exposed_Computation':
                        return <ExposedComputationCreationWizard />;
                    case 'Create_Link_Segment_Program':
                        return <SegmentProgramDefinitionCreationWizard />;
                    case 'Create_Sql':
                        return <SqlScriptCreationWizard />;
                    case 'Create_IntakeProfileDefinition':
                        return <IntakeProfileDefinitionCreationWizard />;
                    case 'Config_PackageReviewers':
                        return <ConfigPackageReviewersWizard configData={data} />;
                    case 'Create_Mask':
                        return <MaskDetailCreationWizard />;
                    case 'Create_Activity_Filter':
                        return <ActivityFilterCreationWizard />;
                    case 'Create_Security_Entity':
                        return <SecurityGroupCreationWizard />;
                    case 'Create_Batch_Screen':
                        return <BatchScreenCreationWizard />;
                    case 'Create_Workflow':
                        return <WorkflowTaskDefinitionCreationWizard />;
                    case 'Manipulate_Oipa_User':
                        return <UserOipa {...data} />
                    case 'Create_Account':
                        return <ChartAccountCreationWizard />;
                    case 'Create_Entity':
                        return <EntityCreationWizard />;
                    case 'Create_Entry':
                        return <EntryCreationWizard />;
                    case 'Duplicate_Entity':
                        return <EntityDuplication {...data} />
                    case 'Create_CommentsTemplate':
                        return <CommentsTemplateCreationWizard />
                    case 'Create_System_Date':
                        return <SystemDateCreationWizard {...data} />
                    case "Manipulate_Config_Package":
                        return <ConfigPackage {...data} />;
                    case "Add_Comment_Config_Package":
                        return <ConfigPackageComment {...data} />;
                    case "Edit_Migration_Set":
                        return <EditMigrationSet {...data}/>
                    case '':
                        return <></>;
                }
            })()}
        </PanelContent>
    );
};

export default (props: any) => (
    <React.Suspense fallback={<Loading />}>
        <ErrorBoundary>
            <RightbarContent {...props} />
        </ErrorBoundary>
    </React.Suspense>
);
