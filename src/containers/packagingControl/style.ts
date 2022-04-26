import styled from 'styled-components';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const PackagingControlContent = styled.div`
   padding: var(--spacing-2x);
   
   .paginator-config,
   .paginator-migration {
       margin-top: var(--spacing-2x);
       > div {
          margin-right: 0;
          padding-top: 0;
       }
   }
   
   .paginator-rules {       
       > div {
          margin-right: 0;
          padding-top: 0;
       }    
   }
   
   .tooltip-ignore {
      margin-right: var(--spacing-1x);
   }
`;

export const AddToWrapper = styled.div`
    display: flex;
    justify-content: center;

    & > div {
        flex: 6 1 auto;
    }

    button {
        margin: 0;
        flex: 1 0 auto;
    }
    
    margin-bottom: var(--spacing-2x);
`;

export const ButtonContent = styled.div`
   > button {
        color: #57666e;
        font-size: 0.75rem;
   }
`;

export const ActionIcon = styled(FontAwesomeIcon)`
   cursor: pointer;
`;

export const ButtonSection = styled.div`
  display: flex;
  flex-direction: column; 
  padding: var(--spacing-2x) 0 0;
`;

export const ModalContainer = styled.div`
   .modal-title {
      margin: 0 0 var(--spacing-2x) 0;
   }
`;

export const ReleaseContainer = styled.div<{ heightDataGrid: number }>`
   height: ${({ heightDataGrid }) => heightDataGrid}px;
   overflow: hidden;
   .MuiDataGrid-window {
      overflow: hidden !important;
   }
`;