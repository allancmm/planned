import styled from "styled-components";

export const TabPanelContainer = styled.div`
   height: calc(100% - 75px);
   overflow-x: hidden;
   overflow-y: auto;
`;

export const TabsContainer = styled.div`
   margin-bottom: var(--spacing-1x);
   .MuiTabs-root {
       height: 60px;
       border-bottom: 1px solid ${({theme}) => theme.greys['dark-grey']};
   }
   
   .MuiTabs-indicator {
       background-color: ${({ theme }) => theme.colors.background.active.nav};
       height: 4px;
   }
`;

export const TabContainer = styled.div`
   .MuiTab-root {
      text-transform: none;
      font-family: Open Sans,sans-serif;
      color: ${({ theme }) => theme.colors.background.active.nav};
      font-size: 0.875rem;
      -webkit-text-stroke-width: 0.4px;
      letter-spacing: inherit;
      min-width: 130px;
   }
      
   svg {
     margin-left: 10px;
     margin-bottom: 0 !important;
     width: 20px;
     height: 20px;
   }  
`;

export const ActionTabContainer = styled.div`
   margin-left: auto;
`;

export const ActionTabContent = styled.div`
    display: flex;
       align-items: center;
       height: 100%;
       margin-right: var(--spacing-2x);
`;