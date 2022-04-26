import styled from "styled-components";

export const ViewLogContainer = styled.div`
   height: 100%;
   padding: var(--spacing-1x);
`;

export const LogDetailContainer = styled.div`
   display: flex;  
   height: calc(100% - 205px);
   overflow-y: auto;
`;

export const LogDetailContent = styled.div`
   display: block;
   padding: 0 var(--spacing-1x);
`;

export const LogNameFileContainer = styled.span`
     font-style: italic;
     font-size: 1.2rem;
`;