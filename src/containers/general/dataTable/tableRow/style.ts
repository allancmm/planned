import styled from 'styled-components';

export const TableRowStyle = styled.div`
    display: contents;
`;

export const LongTableCell = styled.div<{ columnsNumber: number }>`
    grid-column-end: span ${({ columnsNumber }) => columnsNumber};
    display: table-cell;
    min-height: 30px;
    line-height: 30px;
`;

export const CheckBox = styled.input`
    background: ${({ theme }) => theme.colors.background.main};
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.borders.primary};
    height: 16px;
    width: 16px;
`;
