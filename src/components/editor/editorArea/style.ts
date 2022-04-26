import styled from 'styled-components';

export const WrapperContainer = styled.div`
    position: relative;
    height: 100%;
`;

export const EditorWrapper = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    grid-row: 1;
    z-index: 1;
    top: 0;
    left: 0;
`;

export const EditorMain = styled.div<{ highlighted: boolean }>`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    background-color: ${(props) => (props.highlighted ? 'yellow' : props.theme.colors.background.main)};

    & > div:nth-child(2) {
        overflow-x: hidden !important;
        overflow-y: auto !important;
    }
`;

export const BackgroundWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
`;
export const BackgroundImage = styled.img`
    width: 25%;
    margin-top: -5%;
    margin-right: 2%;
`;
export const LabelWrapper = styled.div`
    margin-right: 4%;
`;

export const Label = styled.div`
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 24px;
    padding: 7px 14px;
    font-weight: 600;
`;