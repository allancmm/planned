import styled from 'styled-components';

export const AutomatedStepCardContainer = styled.li<{ selected: boolean; disabled: boolean }>`
    display: flex;
    flex-direction: column;
    background: ${({ theme, disabled }) =>
        disabled ? theme.colors.background.subPanelHeader : theme.colors.background.panel};
    border: 1px solid ${({ theme, selected }) => (selected ? theme.colors.accent.main : theme.colors.borders.secondary)};
    border-radius: 4px;
    padding: 10px 15px;
    margin: 4px 0;
`;


export const AddXmlButton = styled.div`
    font-size: 10px;
    text-transform: uppercase;
    margin: 5px;
    float: right;
    cursor: pointer;
`;
