import styled from "styled-components";

export const ViewManifestContainer = styled.div`
   padding: var(--spacing-1x);
   background-color: ${({ theme }) => theme.colors.background.main};
   color: ${(props) => props.theme.colors.text.primary};
   .secondary-details {
      margin-top: var(--spacing-2x);
   }
`;

export const HistoryContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  > div {
     margin-bottom: var(--spacing-2x);
  }
`;

export const ButtonSection = styled.div`
   display: flex;  
   justify-content: flex-end;
   align-items: flex-end;
   height: 100%
`;