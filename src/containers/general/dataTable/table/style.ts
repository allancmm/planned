import styled from 'styled-components';

export const DataTableContainer = styled.div`
    padding: 8px;
    overflow-y: auto;
    max-height: 100%;
`;

export const HeaderStyle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const Title = styled.p`
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 0;
`;

export const Sorted = styled.div<{ asc: boolean }>`
    float: left;
    &::before {
        color: ${({ theme }) => theme.colors.text.primary};
        content: ${(props) => (props.asc ? "'\\25BC'" : "'\\25B2'")};
    }
`;

export const TableStyle = styled.div<{ columns: number; isCollapsable?: boolean; isSelectable?: boolean }>`
    border-radius: 0.25rem;
    border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
    border-collapse: collapse;

    width: 100%;
    display: grid;
    grid-template-columns: ${({ columns, isCollapsable, isSelectable }) =>
        `${isCollapsable ? '6%' : ''} ${isSelectable ? '6%' : ''} repeat(${columns}, 1fr)`};
    overflow-x: auto;
`;

export const TableVerticalStyle = styled.div<{ columns: number; isCollapsable?: boolean; isSelectable?: boolean }>`
    border-radius: 0.25rem;
    border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
    border-collapse: collapse;

    width: 100%;
    display: grid;
    grid-template-rows: ${({ columns, isCollapsable, isSelectable }) =>
        `${isCollapsable ? '6%' : ''} ${isSelectable ? '6%' : ''} repeat(${columns}, 1fr)`};
    overflow-x: auto;
    grid-auto-flow: column;
`;

export const HeaderLabel = styled.span`
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
    height: 20px;
    letter-spacing: 0px;
    line-height: 20px;
`;
