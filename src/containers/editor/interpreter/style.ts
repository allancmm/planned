import styled from 'styled-components';

export const InterpreterActions = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 0 0 auto;
    height: 32px;

    & > * {
        margin-right: 8px;
    }

    & > label {
        display: inline-flex;
        align-items: center;
    }

    & > div {
        width: 300px;
    }

    & > button {
        border: 1px solid ${({ theme }) => theme.colors.borders.primary};
        border-radius: 5px;
        vertical-align: middle;
        text-align: center;
        padding: 0px;
        flex: 1 1 40px;
        width: 40px;
        margin-top: 0;
    }
`;
