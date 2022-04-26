import styled from "styled-components";

const Border = '1px solid rgba(0, 0, 0, 0.12)';

export const ResultLogContainer = styled.div`
  padding: 0 var(--spacing-2x); 
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-1x);
  height: var(--spacing-4x);
  cursor: pointer;
  border: ${Border};
  background-color: rgba(0, 0, 0, .03);
  
  > div { 
     margin-left: auto;
  }
`;

export const ResultContent = styled.div`
   border: ${Border};
   padding: var(--spacing-2x);
`;

export const CommentContent = styled.div`
   margin-left: var(--spacing-3x);
`;

export const CommentDetail = styled.div`
   overflow-x: auto;
`;

export const CommentDetailContainer = styled.div`
   margin-bottom: var(--spacing-1x);
`;