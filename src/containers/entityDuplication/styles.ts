import styled from "styled-components";

export const DuplicateContainer =  styled.form`
    padding: 0 14px;
    
    hr {
        background-color: ${({ theme }) => theme.colors.background.separator };
        border: 0;
        height: 1px;
        margin: var(--spacing-2x) auto;
        width: 100%;
    }
`;

