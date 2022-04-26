import { Caret } from 'equisoft-design-ui-elements';
import produce, { Draft } from 'immer';
import React, { Children, cloneElement, useEffect, useState } from 'react';
import { DataTableColumn } from '../table';
import TableCell from '../tableCell';
import { TableCellContainer } from '../tableCell/style';
import { CheckBox, LongTableCell, TableRowStyle } from './style';
import NoRecordsFound from "../../../../components/general/noRecordsFound";

interface TableRowProps {
    value: any;
    selectedData?: any[];
    columns: DataTableColumn[];
    expandable?: boolean;
    expandableComponent?: React.ReactNode;
    expandableCondition?: boolean;
    selectable?: boolean;
    isEmptyRow?: boolean;
    isEditMode?: boolean;
    centerTiles?: boolean;

    onCheck(value: any): void;
    findProps(obj: any, prop: string): any;
    updateRow?(newRow: any): void;
    transformForExpandable?(d: any): any | Promise<any>;
}

const TableRow = ({
    value,
    selectedData,
    onCheck,
    findProps,
    columns,
    expandable,
    expandableComponent,
    expandableCondition = true,
    selectable,
    isEmptyRow,
    isEditMode,
    centerTiles,
    updateRow,
    transformForExpandable,
}: TableRowProps) => {
    const [expanded, setExpanded] = useState(false);
    const [expandedData, setExpandedData] = useState(value);

    useEffect(() => {
        if (expanded) computeExpandedData();
    }, [expanded]);

    const computeExpandedData = async () => {
        setExpandedData(transformForExpandable ? await transformForExpandable(value) : value);
    };

    const renderChildren = (children: any, data: any) =>
         Children.map(children, (child) => cloneElement(child, { data }));

    const updateCell = (recipe: (draft: Draft<any>) => void) => {
        updateRow?.(produce(value, recipe));
    };
    const columnsNumber = columns.length + (expandable ? 1 : 0) + (selectable ? 1 : 0);
    return (
        <TableRowStyle>
            {expandable &&
                (expandableCondition ? (
                    <TableCellContainer onClick={() => setExpanded(!expanded)}>
                        <Caret isExpand={expanded} />
                    </TableCellContainer>
                ) : (
                    <TableCellContainer />
                ))}
            {selectable && (
                <TableCellContainer>
                    <CheckBox
                        type="checkbox"
                        checked={selectedData && selectedData.includes(value)}
                        onChange={() => onCheck(value)}
                    />
                </TableCellContainer>
            )}
            {isEmptyRow ? (
                <NoRecordsFound />
            ) : (
                columns.map((col: DataTableColumn, index) => (
                    <TableCell
                        key={col.selector ?? index}
                        col={col}
                        value={value}
                        isEditMode={isEditMode}
                        centerText={centerTiles}
                        findProps={findProps}
                        updateCell={updateCell}
                        isHeader={col.forceIsHeader}
                    />
                ))
            )}
            {expanded && (
                <LongTableCell columnsNumber={columnsNumber}>
                    {renderChildren(expandableComponent, expandedData)}
                </LongTableCell>
            )}
        </TableRowStyle>
    );
};

export default TableRow;
