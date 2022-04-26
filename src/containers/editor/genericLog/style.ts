import styled from "styled-components";

export const LogContainer = styled.div`
   padding: var(--spacing-1x);
`;

export const LogDetailContainer = styled.div`
   display: flex;  
   height: calc(100% - 100px);
   overflow-y: auto;
`;

export const LogDetailContent = styled.div`
   display: block;
   padding: 0 var(--spacing-2x);
`;