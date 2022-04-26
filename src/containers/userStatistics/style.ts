import styled from 'styled-components';
import DataTable from '../general/dataTable/table';

export const HeaderContainer = styled.div`
  padding: var(--spacing-1x) var(--spacing-1x) 0 var(--spacing-1x);
`;

export const BodyContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    margin: auto;
    padding: 0 0 0 var(--spacing-1x);
`;

export const Panel = styled.div`
    white-space: pre;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    background-color: ${(props) => props.theme.colors.background.panel};
    color: ${(props) => props.theme.colors.text.primary};
    margin: 0.5% 0.25%;
`;

export const PanelGridContainer = styled.div`
    padding: var(--spacing-1x);
`;

export const PanelGrid = styled(DataTable)`
    overflow: auto;
    overflow-y: auto;
`;
