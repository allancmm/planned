import styled from 'styled-components';
import DataTable from '../general/dataTable/table';

export const Container = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
    overflow-y: auto;
    margin: auto;
`;

export const Panel = styled.div`
    white-space: pre;
    background-color: ${(props) => props.theme.colors.background.panel};
    color: ${(props) => props.theme.colors.text.primary};
    margin: 0.5% 0.25%;
    width: 99.5%;
    display: flex;
    flex-direction: column;
`;

export const PanelGrid = styled(DataTable)`
    overflow-x: visible;
`;

export const NameSection = styled.span`
    display: flex;
    align-items: center;
    text-transform: none;
`;
