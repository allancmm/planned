import { Square } from 'react-feather';
import styled, { css } from 'styled-components';

export const DefaultBadge = styled.div`
    border-radius: 15%;
    display: inline-block;
    font-size: small;
    font-weight: 550;
    height: 16px;
    width: 23px;
    line-height: 8px;
    margin-right: 5px;
    overflow: hidden;
    text-align: center;
    text-overflow: clip;
    flex-shrink: 0;
    padding: 3px 2px;
    text-transform: none;
    white-space: nowrap;
`;

export const GroupedEntityListContainer = styled.div`
    display: flex;
    flex-direction: column;

    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
`;

export const EntitySummaryListContainer = styled.div`
    display: grid;
    grid-template-columns: 3fr 4px 2fr auto;
    justify-items: start;
    justify-content: stretch;
    position: relative;

    & > div {
        width: 100%;
    }
`;

const BaseSummary = css`
    display: flex;
    justify-content: start;
    align-items: center;
    padding-left: 4px;
    min-width: 0;
    max-width: 100%;
`;

export const SummaryHeaderSection = styled.div`
    ${BaseSummary}
    cursor: pointer;

    border-bottom: 1px solid ${({ theme }) => theme.colors.borders.primary};
    padding-top: 4px;
    margin-bottom: 4px;

    span {
        font-weight: bold;
    }
`;

export const CheckboxContent = styled.div`  
   margin: 0 4px;
`;

export const SummarySection = styled.div`
    ${BaseSummary}
    padding-left: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    flex-direction: column;   
    span {
      display: inline-block;
      text-overflow: ellipsis;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
    }

    span.groupedOverride {
        width: 100%;
    }

    span.content {
        font-weight: 550;
        max-width: 100%;
    }

    ${DefaultBadge}.groupedoverride {
        height: 14px;
        width: 20px;
        font-size: 11px;
    }

    .hover {
          background: ${({ theme }) => theme.colors.background.hover.nav};
    }
    
    &.selected {
        background: ${({ theme }) => theme.colors.background.hover.nav};
    }
    
    div {
       display: flex;
    }
    
    .container {
       display: inline-flex; 
       align-items: center;
       width: 100%;
       min-height: var(--spacing-3x); 
    }
    
    .container-children {
        display: inline-flex; 
        align-items: center;
        height: var(--spacing-3x);
        width: 100%; 
        &:hover {
           background: ${({ theme }) => theme.colors.background.hover.nav};
       }
    }
        
    .entity-type-custom {
        display: unset;
    }
    
    .type-badge {
       display: block;
    }
`;
export const CheckBoxContainer = styled.div`
   margin-left: 4px;
`;

export const GroupedSummarySection = styled.span`
    width: 100%;
    padding: 0 0 var(--spacing-1x) var(--spacing-2x);
`;

export const SummaryGutter = styled.div`
    cursor: col-resize;
    background: ${({ theme }) =>
        `linear-gradient(to right, transparent, transparent 33.33%, ${theme.colors.borders.primary} 33.33%, ${theme.colors.borders.primary} 66.66%, transparent 66.66%)`};
`;

export const BasicBadge = styled(DefaultBadge)`
    background-color: #505f79;
    color: white;
`;

export const TransactionBadge = styled(DefaultBadge)`
    background-color: #1560bd;
    color: white;

    &:before {
        content: 'tr';
    }
`;

export const ActivityBadge = styled(DefaultBadge)`
    background-color: blue;
    color: white;

    &:before {
        content: 'ac';
    }
`;

export const BusinessRulesBadge = styled(DefaultBadge)`
    background-color: #f1300a;
    color: white;

    &:before {
        content: 'br';
    }
`;

export const SegmentNameBadge = styled(DefaultBadge)`
    background-color: #0bbf54;
    color: white;

    &:before {
        content: 'sn';
    }
`;

export const AsFileBadge = styled(DefaultBadge)`
    background-color: #795a8f;
    color: white;

    &:before {
        content: 'fi';
    }
`;

export const AsFileOutputBadge = styled(DefaultBadge)`
    background-color: #bc07ee;
    color: white;

    &:before {
        content: 'fo';
    }
`;

export const AgreementDefinitionBadge = styled(DefaultBadge)`
    background-color: #ff007c;
    color: white;

    &:before {
        content: 'ad';
    }
`;

export const InquiryScreenBadge = styled(DefaultBadge)`
    background-color: #7df9ff;
    color: white;

    &:before {
        content: 'inq';
    }
`;

export const MaskBadge = styled(DefaultBadge)`
    background-color: #cd9575;
    color: white;

    &:before {
        content: 'mk';
    }
`;

export const RequirementDefinitionBadge = styled(DefaultBadge)`
    background-color: #fb9902;
    color: white;

    &:before {
        content: 'rd';
    }
`;

export const RequirementGroupBadge = styled(DefaultBadge)`
    background-color: #fb9902;
    color: white;

    &:before {
        content: 'rc';
    }
`;

export const QuoteDefinitionBadge = styled(DefaultBadge)`
    background-color: #fdbe02;
    color: white;

    &:before {
        content: 'qd';
    }
`;

export const AccountChartBadge = styled(DefaultBadge)`
    background-color: #fdbe04;
    color: white;

    &:before {
        content: 'ca';
    }
`;

// TODO: validate color with mvachon
export const AccountChartEntityBadge = styled(DefaultBadge)`
    background-color: #fdbe04;
    color: white;

    &:before {
        content: 'cae';
    }
`;

// TODO: validate color with mvachon
export const AccountChartEntryBadge = styled(DefaultBadge)`
    background-color: #f7d87c;
    color: white;

    &:before {
        content: 'car';
    }
`;

export const IntakeProfileDefinitionBadge = styled(DefaultBadge)`
    background-color: #4de887;
    color: white;

    &:before {
        content: 'ipd';
    }
`;

export const ExposedComputationBadge = styled(DefaultBadge)`
    background-color: #ba3be4;
    color: white;

    &:before {
        content: 'ec';
    }
`;

export const RateBadge = styled(DefaultBadge)`
    background-color: #00b7eb;
    color: white;

    &:before {
        content: 'rt';
    }
`;

export const MapBadge = styled(DefaultBadge)`
    background-color: #f56fa1;
    color: white;

    &:before {
        content: 'mp';
    }
`;

export const CodeBadge = styled(DefaultBadge)`
    background-color: #c9a0dc;
    color: white;

    &:before {
        content: 'cd';
    }
`;

export const CompanyBadge = styled(DefaultBadge)`
    background-color: black;
    color: white;

    &:before {
        content: 'co';
    }
`;

export const ProductBadge = styled(DefaultBadge)`
    background-color: grey;
    color: white;

    &:before {
        content: 'pr';
    }
`;

export const PlanBadge = styled(DefaultBadge)`
    background-color: #00b7eb;
    color: white;

    &:before {
        content: 'pl';
    }
`;

export const BatchScreenBadge = styled(DefaultBadge)`
    background-color: #704214;
    color: white;

    &:before {
        content: 'bs';
    }
`;

export const ProgramDefinitionBadge = styled(DefaultBadge)`
    background-color: #aad5a5;
    color: white;

    &:before {
        content: 'pd';
    }
`;

export const CommentsTemplateBadge = styled(DefaultBadge)`
    background-color: #ff9966;
    color: white;

    &:before {
        content: 'ct';
    }
`;

export const SqlBadge = styled(DefaultBadge)`
    background-color: #505f79;
    color: white;

    &:before {
        content: 'sql';
    }
`;

export const WorkflowQueueRoleBadge = styled(DefaultBadge)`
    background-color: #891446;
    color: white;

    &:before {
        content: 'wq';
    }
`;

export const WorkflowTaskDefinitionRoleBadge = styled(DefaultBadge)`
    background-color: #891446;
    color: white;

    &:before {
        content: 'wt';
    }
`;

export const FundBadge = styled(DefaultBadge)`
    background-color: #36068e;
    color: white;

    &:before {
        content: 'fd';
    }
`;

export const DataFileBadge = styled(DefaultBadge)`
    background-color: #505f79;
    color: white;

    &:before {
        content: 'df';
    }
`;

export const PackageBadge = styled(DefaultBadge)`
    background-color: #505f79;
    color: white;

    &:before {
        content: 'pk';
    }
`;

export const MigrationSetBadge = styled(DefaultBadge)<{ text?: string}>`
    background-color: #e2725b;
    color: white;

    &:before {
        content: ${({ text }) => text ?? "'ms'" };
    }
`;

export const CountryBadge = styled(DefaultBadge)`
    background-color: #e2725b;
    color: white;

    &:before {
        content: 'co';
    }
`;

export const ChartOfAccountsBadge = styled(DefaultBadge)`
    background-color: #c2b280;
    color: white;

    &:before {
        content: 'coa';
    }
`;

export const RequirementCriteriaBadge = styled(DefaultBadge)`
    background-color: #e9cc86;
    color: white;

    &:before {
        content: 'rc';
    }
`;

export const CurrencyBadge = styled(DefaultBadge)`
    background-color: #e2725b;
    color: white;

    &:before {
        content: 'cu';
    }
`;

export const MarketMakerBadge = styled(DefaultBadge)`
    background-color: #20b2aa;
    color: white;

    &:before {
        content: 'mm';
    }
`;

export const ErrorCatalogBadge = styled(DefaultBadge)`
    background-color: #7c0a02;
    color: white;

    &:before {
        content: 'er';
    }
`;

export const PlanStateApprovalBadge = styled(DefaultBadge)`
    background-color: #bcd4e6;
    color: white;

    &:before {
        content: 'psa';
    }
`;

export const SegmentStateApprovalBadge = styled(DefaultBadge)`
    background-color: #bcd4e6;
    color: white;

    &:before {
        content: 'ssa';
    }
`;

export const PlanProgramDefinitionBadge = styled(DefaultBadge)`
    background-color: #547a4e;
    color: white;

    &:before {
        content: 'ppd';
    }
`;

export const SegmentProgramDefinitionBadge = styled(DefaultBadge)`
    background-color: #547a4e;
    color: white;

    &:before {
        content: 'spd';
    }
`;

export const SystemDateBadge = styled(DefaultBadge)`
    background-color: #4992af;
    color: white;

    &:before {
        content: 'sd';
    }
`;

export const TranslationBadge = styled(DefaultBadge)`
    background-color: #ffb200;
    color: white;

    &:before {
        content: 'tl';
    }
`;

export const TransactionProcessBadge = styled(DefaultBadge)`
    background-color: #ffb230;
    color: white;

    &:before {
        content: 'tp';
    }
`;

export const AdmUserGroupBadge = styled(DefaultBadge)`
    background-color: #00d0ff;
    color: white;

    &:before {
        content: 'adm';
    }
`;

export const AdmUserBadge = styled(DefaultBadge)`
    background-color: #006296;
    color: white;

    &:before {
        content: 'usr';
    }
`;

export const OipaEnvironmentBadge = styled(DefaultBadge)`
    background-color: #006296;
    color: white;

    &:before {
        content: 'env';
    }
`;

export const MigrationPathBadge = styled(DefaultBadge)`
    background-color: #006296;
    color: white;

    &:before {
        content: 'mp';
    }
`;

export const SequenceBadge = styled(DefaultBadge)`
    background-color: #e34234;
    color: white;

    &:before {
        content: 'sq';
    }
`;

export const ActivityFilterBadge = styled(DefaultBadge)`
    background-color: #d84d66;
    color: white;

    &:before {
        content: 'af';
    }
`;

export const CompanyPrimaryBadge = styled(DefaultBadge)`
    background-color: black;
    color: white;

    &:before {
        content: 'pc';
    }
`;

export const CompanySubBadge = styled(DefaultBadge)`
    background-color: #404040;
    color: white;

    &:before {
        content: 'sc';
    }
`;

export const GlobalBadge = styled(DefaultBadge)`
    background-color: white;
    border: 1px solid black;
    color: black;
    &:before {
       content: 'gb'
    }
`;

export const OipaUserBadge = styled(DefaultBadge)`
    background-color: #724dd8;
    color: white;
    &:before {
       content: 'ou'
    }
`;

export const FunctionTestBadge = styled(DefaultBadge)`
    background-color: #724dd8;
    color: white;
    &:before {
       content: 'fct'
    }
`;

export const FunctionalTestSuiteBadge = styled(DefaultBadge)`
   background-color: #724dd8;
   color: white;
   &:before {
       content: 'fts';
   }
`;

export const OipaSecurityGroupBadge = styled(DefaultBadge)`
    background-color: #724dd8;
    color: white;
    &:before {
       content: 'sg'
    }
`;

export const UnitTestReportBadge = styled(DefaultBadge)`
    background-color: #724dd8;
    color: white;
    &:before {
       content: 'utr'
    }
`;

export const FunctionalTestStepBadge = styled(DefaultBadge)`
    background-color: #006296;
    color: white;
    &:before {
       content: 'fts'
    }
`;

export const UnitTestBadge = styled(DefaultBadge)`
    background-color: #724dd8;
    color: white;
    &:before {
       content: 'ut'
    }
`;

export const FunctionalTestSuiteResultBadge = styled(DefaultBadge)`
    background-color: #006296;
    color: white;
    &:before {
       content: 'ftr'
    }
`;

export const SystemFileBadge = styled(DefaultBadge)`
    background-color: #4dd879;
    color: white;
    &:before {
       content: 'sf'
    }
`;

export const ViewManifestBadge = styled(DefaultBadge)`
    background-color: #4dd879;
    color: white;
    &:before {
       content: 'vm'
    }
`;

export const ViewLogReleaseReportBadge = styled(DefaultBadge)`
    background-color: #4dd879;
    color: white;
    &:before {
       content: 'dtl'
    }
`;

const IconStyle = css`
    width: 12px;
    height: 12px;
    margin-right: 10px;
    stroke-width: 3;
`;

export const EntityIcon = styled(Square)`
    ${IconStyle}
`;

export const EmptyCheckSpace = styled.div`
    min-width: var(--spacing-3x);
    display: table;
`;