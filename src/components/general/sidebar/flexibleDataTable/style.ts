import styled, { css } from 'styled-components';
import { PaginatorStyle } from '../../../../containers/general/dataTable/paginator/style';

export const FlexTableContainer = styled.div`
    .pagination-container {
       margin-top: 16px;
    }
`;

export const FlexibleDataTableGrid = styled.div<{ colNumber: number }>`
    display: grid;
    grid-template-columns: ${(props) => Array(props.colNumber - 1).fill('1fr 4px ')}1fr;
    justify-items: start;
    justify-content: stretch;
    position: relative;
`;

const FlexibleDataTableCell = css`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    overflow: hidden;

    & > span {
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const FlexibleDataTableGutter = styled.div`
    ${FlexibleDataTableCell}
    cursor: col-resize;
    background: ${({ theme }) =>
        `linear-gradient(to right, transparent, transparent 33.33%, ${theme.colors.borders.primary} 33.33%, ${theme.colors.borders.primary} 66.66%, transparent 66.66%)`};
`;

export const FlexibleDataTableHeader = styled.div`
    ${FlexibleDataTableCell}

    border-bottom: 1px solid ${({ theme }) => theme.colors.borders.primary};
    padding-top: 4px;
    margin-bottom: 4px;

    span {
        font-weight: bold;
    }
`;

export const FlexibleDataTableMain = styled.div`
    ${FlexibleDataTableCell}
    cursor: pointer;

    &.hover,
    &.selected {
        background: ${({ theme }) => theme.colors.accent.main};
        color: ${({ theme }) => theme.colors.text.secondary};
    }
`;

export const ActionBar = styled.div<{ show: boolean }>`
    display: ${(props) => (props.show ? 'flex' : 'none')};
    margin-left: auto;
    align-items: center;
    justify-content: center;
    button {
        height: 20px;
        width: 20px;
        min-height: 20px;
        margin-right: 4px;
        color: ${({ theme }) => theme.colors.text.secondary};
        :hover {
          background: #fff;
          color: ${({ theme }) => theme.colors.accent.main};
       }
    }
`;

export const SearchWrapper = styled.div`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0 0 16px 0;
    button {
        width: 28px;
        height: 32px;
        border-radius: 0px 4px 4px 0px;
        color: ${(props) => props.theme.colors.text.primary};
        outline: none;
        background: ${({ theme }) => theme.colors.background.panel};
        border: 1px solid ${({ theme }) => theme.colors.borders.secondary};
        border-left: 0;
        flex: 0 0 auto;
        margin: 0;
        padding: 0;
        cursor: pointer;

        &:focus {
            border-color: ${({ theme }) => theme.colors.accent.main};
        }
    }

    ${PaginatorStyle} {
        flex-grow: 2;
    }
    
    .all-migration-sets {
        margin-top: 16px;
    }
    
    .paginator-packaging-control {
        margin-top: 9px;
    }
`;

export const CheckboxContainer = styled.div` 
    margin: 0 5px;
   .box {
     top: 2px;
     left: 2px;
   }   
`;


