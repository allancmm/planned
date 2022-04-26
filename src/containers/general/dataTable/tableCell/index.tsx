import { Draft } from 'immer';
import React, { ChangeEvent, ReactNode } from 'react';
import { DataTableColumn } from '../table';
import { TableCellContainer, TableInput } from './style';

interface TableCellProps {
    value: any;
    col: DataTableColumn;
    isEditMode?: boolean;
    centerText?: boolean;
    isHeader?: boolean;
    updateCell(recipe: (draft: Draft<any>) => void): void;
    findProps(obj: any, prop: string): any;
}

const TableCell = ({ value, col, isEditMode, centerText, isHeader, updateCell, findProps }: TableCellProps) => {
    const displayCell = (): ReactNode => {
        if (col.cell) {
            return col.cell(value);
        }
        return getValueString();
    };

    const getValueString = (): string => {
        if (col.selector) {
            return col.format ? col.format(value) : findProps(value, col.selector);
        }
        return '';
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        updateCell((draft) => {
            if (col.selector) {
                draft[col.selector] = e.target.value;
            }
        });
    };

    return (
        <TableCellContainer centerText={centerText} isHeader={isHeader} className={col?.styleCell}>
            {isEditMode && !col.isUnmodifiable && !col.cell ? (
                <TableInput type="text" value={getValueString()} onChange={handleInputChange} />
            ) : (
                displayCell()
            )}
        </TableCellContainer>
    );
};

export default TableCell;
