import styled from 'styled-components';

export const ResultContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 5px;    
    height: 100%;
    overflow: auto;
`;

export const ResultRow = styled.div`
    margin-bottom: 5px;
    display: inline-flex;

    & > div {
        text-indent: 5px;
    }
`;

export const TaskType = styled.div<{ margin: string }>`
    &::before {
        content: '[';
    }
    &::after {
        content: ']';
    }
    margin-left: ${({ margin }) => margin}
`;

export const TaskStatus = styled.div<{ color: string }>`
    &::before {
        content: '- ';
    }
    color: ${({ color }) => color};
    white-space: nowrap;
`;

export const TaskFailure = styled.div<{ color: string }>`
    &::before {
        content: '- ';
    }
    color: ${({ color }) => color};
`;
