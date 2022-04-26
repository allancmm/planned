import styled from 'styled-components';

export const AttachedRulesContainer = styled.div`
    max-height: 300px;
    margin: var(--spacing-2x) 0 var(--spacing-4x) var(--spacing-2x);
    & > div {
        max-height: 300px;
        overflow: auto;
    }
`;

export const ProcessingOrderSection = styled.div`
    > div {
        display: flex;
        align-items: center;
        min-height: 30px;      
    }
    & button {
        margin-top: 20px;
        }
`;