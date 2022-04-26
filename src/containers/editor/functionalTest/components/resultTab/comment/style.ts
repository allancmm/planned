import styled from "styled-components";

export const CommentContainer = styled.div`
   margin-bottom: var(--spacing-1x);
`;

export const XmlContainer = styled.div`
      max-height: 250px;
      margin: 0 0 var(--spacing-1x) var(--spacing-3x);
      overflow: auto;      
      > div {
         height: 100%;         
      }
`;

export const DetailLogContainer = styled.div`
      display: flex;
      width: 100%;
      overflow-x: auto;
      span:first-child {
        white-space: nowrap;
        margin-right: var(--spacing-1x);
      }
`;

export const DetailMessage = styled.div`
   overflow-x: auto;
`;