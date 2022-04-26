import styled from "styled-components";
import { CustomCard } from "../../components/general";

export const TestResultViewerContainer = styled.div`
     padding: 5px; 
     height: 100%;
     overflow: auto; 
     background-color: ${({ theme }) => theme.colors.background.main};
     color: ${(props) => props.theme.colors.text.primary};     
     .detail-status {
        height: calc(100% - 55px);
        overflow: auto;
        background: ${({ theme }) => theme.colors.background.main };
     }  
     
     h2 {
       margin-top: 0;
     }
`;

export const AssessmentContainer = styled.div`
   display: flex;
   flex-direction: column; 
   padding: 8px 0 8px 48px;
   
   .detail {
      margin-left: 18px;
   }
`;

export const StatusContainer = styled.div`
   display: flex; 
   flex-direction: row;
   
   .icon-label {
      margin-left: 6px;
   }
`;

export const StatusIconContainer = styled.div`
   cursor: default;   
   & svg {
      width: 12px;
      height: 12px;
   }     
`;

export const HeaderContainer = styled.header<{ hasChildren: boolean}>`
   padding: var(--s-base);
   display: flex;
   cursor:  ${({ hasChildren }) => hasChildren ? 'pointer' : 'default'};
   
   .entity-badge {
       margin-top: 1px;
   }
   
   .icon-expand {
      display: flex;
      width: 25px;
   }
   
   .content {
      display: flex;
      width: calc(100% - 25px);
   }
   
   .icon-status {
      display: flex;
      margin-right: 6px;
   }
   
`;

export const TestSuiteContainer = styled.div`
   padding: 0 16px;
   
   .details-container {
      margin-left: 48px;
   }
`;

export const TestSuiteStatusContainer = styled.div<{color: string}>`
  border: 1px solid ${({ color }) => color};
  border-radius: var(--border-radius);
  padding: 6px;
  height: 32px;
  cursor: pointer;
  
  .suite-status {
     display: flex;
     color: ${({ color }) => color};
  }
`;

export const SummaryReport = styled(CustomCard)`
   padding: var(--spacing-2x) var(--spacing-4x);
   height: 100%;
         
   .summary-total-case {
      margin-bottom: 0;
   }
   
   .summary-status-details {
        margin-left: 64px;
        span {
          display: inline-block;
          width: 100%;
        }
   }
`;

export const StatusDetail = styled.span<{ color: string }>`
   color: ${({ color }) => color}
`;

export const DetailsStatus = styled(CustomCard)`
   padding: var(--spacing-2x) var(--spacing-4x);
   height: 100%;
   > div {
      padding: 0 4px 16px;
   }
`;