import styled from 'styled-components';

export const GenerateXmlForm = styled.form`
    display: flex;
    flex-direction: column;
    padding: 10px;

    > div {
        > header {
            border-bottom: none;
        }
    }
`;

export const OptionWrapper = styled.div`
    line-height: 20px;
    letter-spacing: 0.2px;
`;

export const OptionCheckboxWrapper = styled.div`
    display: flex;
    padding-right: 30px;
    align-items: center;

    & > input {
        margin-left: 0px;
    }

    & > label {
        font-size: 14px;
        letter-spacing: 0.4px;
    }
`;

export const GenerateXmlWrapper = styled.div``;

export const OptionSelectionWrapper = styled.div`
    margin: 8px 0px;
`;

export const SelectionWrapper = styled.div`
    padding-top: 8px;
`;

export const CodeWrapper = styled.div`
    display: flex;

    div:last-child {
        margin-left: 8px;
        margin-top: 0;
    }
`;
