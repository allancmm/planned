import styled from "styled-components";

export const StatusContainer = styled.div<{ background: string }>`
    display: flex;
    align-items: center;
    height: var(--spacing-3x);
    width: 90px;
    color: ${({ theme }) => theme.colors.content.active.nav };
    border-radius: var(--spacing-2x);
    padding: 0 6px;
    
    background-color: ${({ background }) => background } ;
    
    > span {
       padding-left: var(--s-half);
    }
`;