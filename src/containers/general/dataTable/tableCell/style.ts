import { inputsStyle } from 'equisoft-design-ui-elements';
import styled from 'styled-components';

export const TableCellContainer = styled.div<{ isHeader?: boolean; centerText?: boolean }>`
    display: table-cell;
    min-height: 20px;
    line-height: 20px;
    min-width: 50px;
    padding: 1px var(--s-base);
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    white-space: pre-wrap;
    hyphens: auto;

    text-align: ${(props) => (props.centerText ? 'center' : 'left')};

    background: ${({ theme, isHeader }) =>
        isHeader ? theme.colors.background.subPanelHeader : theme.colors.background.main};

    border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
`;

export const TableInput = styled.input`
    ${inputsStyle}

    background: ${({ theme }) => theme.colors.background.panel};
`;
