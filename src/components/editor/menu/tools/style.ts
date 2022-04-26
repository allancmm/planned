import styled from 'styled-components';

export const Header = styled.div`
    line-height: 24px;
    padding: 14px 14px;
    text-align: center;
    font-weight: 600;
`;

export const ToolsRightbarForm = styled.form`
    margin: 10px;
`;

export const FieldWrapper = styled.div`
    & > div {
        padding-top: 15px;
        display: flex;
        flex-direction: column;

        & > button {
            width: fit-content;
            margin: auto;
        }
    }
`;

export const ActionButton = styled.div`
    padding: 15px 0px;
    display: flex;
    width: fit-content;
    margin: auto;
`;
