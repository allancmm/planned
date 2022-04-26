import styled from "styled-components";

export const Field = styled.div`
    color: ${(props) => props.theme.notifications['alert-2.1']}; 
    display: flex;
    font-size: 0.75rem;
    font-weight: var(--font-normal);
    letter-spacing: 0.02rem;
    line-height: 1.25rem;
`;

export const StyledSpan = styled.span`
    margin-left: var(--spacing-base);
`;

export const StyledIcon = styled.div`
    align-items: center;
    display: flex;
`;