import styled from 'styled-components';

export const AttachedRulesContainer = styled.div`
    max-height: 300px;
    margin-bottom: 4px;
    & > div {
        max-height: 300px;
        overflow: auto;
    }
`;
