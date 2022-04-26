import { TextInput } from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import UndoToast from '../../../../components/general/undoToast';
import Pageable from '../../../../lib/domain/util/pageable';
import { nullSafeCompare } from '../../../../lib/util/compare';
import Paginator from '../paginator';
import { TableCellContainer } from '../tableCell/style';
import TableRow from '../tableRow';
import { TableRowStyle } from '../tableRow/style';
import { DataTableContainer, HeaderLabel, HeaderStyle, Sorted, TableStyle, TableVerticalStyle, Title } from './style';

interface DataTableProps {
    title?: string;
    columns: DataTableColumn[];
    data: any[];
    keyColumn: string;
    defaultSortColumn?: string;
    selectedData?: any[];
    page?: Pageable;
    actions?: React.ReactNode;
    expandable?: boolean;
    expandableComponent?: React.ReactNode;
    selectable?: boolean;
    hasSearchBar?: boolean;
    placeHolderSearchBar?: string;
    sortDesc?: boolean;
    isEditMode?: boolean;
    centerTiles?: boolean;
    displayHeader?: boolean;
    vertical?: boolean;
    expandableCondition?(value: any): boolean;
    setSelectedData?(data: any[]): void;
    setPage?(page: Pageable): void;
    deleteDefinetly?(toDelete: any[]): void;
    updateTable?(newTable: any[]): void;
    transformForExpandable?(d: any): any | Promise<any>;
    onChangeSearchBar?(value: string):void;
}

interface SortColumnProps {
    name: string;
    asc: boolean;
}

export interface DataTableColumn {
    name: string;
    selector?: string;
    isUnmodifiable?: boolean;
    forceIsHeader?: boolean;
    styleCell?: string;
    cell?(value: any): React.ReactNode;
    format?(value: any): string;
}

const DataTable = ({
                       title,
                       columns,
                       data,
                       keyColumn,
                       defaultSortColumn = '',
                       selectedData,
                       setSelectedData,
                       page,
                       setPage,
                       actions,
                       deleteDefinetly,
                       expandable,
                       expandableComponent,
                       expandableCondition,
                       selectable,
                       hasSearchBar = true,
                       placeHolderSearchBar,
                       onChangeSearchBar,
                       sortDesc,
                       isEditMode,
                       centerTiles = false,
                       updateTable,
                       transformForExpandable,
                       displayHeader = true,
                       vertical = false,
                   }: DataTableProps) => {
    const [sortedColumn, setSortedColumn] = useState<SortColumnProps>({
        name: defaultSortColumn,
        asc: !sortDesc,
    });
    const [searchText, setSearchText] = useState('');

    const [deleteBuffer, setDeleteBuffer] = useState<any[]>([]);
    const deleteBufferRef = useRef<any[]>(deleteBuffer);
    const [toggleClearSelectedRows, setToggleClearSelectedRows] = useState(false);
    const [tableIsEmpty, setTableIsEmpty] = useState(true);

    useEffect(() => {
        setTableIsEmpty(data.length === 0);
    }, [sortedColumn, searchText, selectedData, toggleClearSelectedRows, data]);

    const findProps = (obj: any, prop: string): any => {
        let o = obj;
        const s = prop.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
        const a = s.split('.');
        for (let i = 0, n = a.length; i < n; ++i) {
            const k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    };

    const sortData = (dataToSort: any[], column: string, asc: boolean) => {
        return dataToSort.sort((a, b) => {
            const valueA = findProps(a, column);
            const valueB = findProps(b, column);
            if (isDate(valueA)) {
                return compareDate(new Date(valueA), new Date(valueB), asc);
            } else {
                if (asc) {
                    return nullSafeCompare(valueA, valueB);
                } else {
                    return nullSafeCompare(valueB, valueA);
                }
            }
        });
    };

    const compareDate = (dateA: Date, dateB: Date, asc: boolean): number => {
        if (asc) {
            return dateA < dateB ? -1 : dateA < dateB ? 1 : 0;
        } else {
            return dateA > dateB ? -1 : dateA < dateB ? 1 : 0;
        }
    };

    const isDate = (value: any): boolean => {
        return value instanceof Date;
    };

    const handleChangeSort = (colName: string) => {
        if (sortedColumn.name === colName) {
            setSortedColumn({ name: colName, asc: !sortedColumn.asc });
        } else {
            setSortedColumn({ name: colName, asc: sortedColumn.asc });
        }
    };

    const handleSearch = (d: any[], text: string) => {
        let currentData: any[] = [];
        let newData: any[];

        if (text !== '') {
            currentData = d;

            newData = currentData.filter((anyObject: any) => {
                let contains = false;

                columns.forEach((col: DataTableColumn) => {
                    if (col.selector) {
                        const lc = findProps(anyObject, col.selector)?.toString()?.toLowerCase();
                        const filter = text.toLowerCase();
                        if (lc?.includes(filter)) {
                            contains = true;
                        }
                    }
                });

                return contains;
            });
        } else {
            newData = d;
        }
        return newData;
    };

    const getFilteredData = (
        rawData: any[],
        search: string,
        sortedCol: SortColumnProps,
        toggleClear: boolean,
        selectedRawData?: any[],
    ) => {
        let filteredData = handleSearch(rawData, search);
        if (sortedCol.name && !isEditMode) {
            filteredData = sortData(filteredData, sortedCol.name, sortedCol.asc);
        }

        if (toggleClear && selectedRawData) {
            filteredData = filteredData.filter((v) => !selectedRawData.includes(v));
        }

        return filteredData;
    };

    const onCheck = (item: any) => {
        if (selectedData && setSelectedData) {
            if (selectedData.find((value: any) => value === item)) {
                setSelectedData([...selectedData.filter((v) => v !== item)]);
            } else {
                setSelectedData([...selectedData, item]);
            }
        }
    };

    const checkAll = () => {
        if (selectedData && setSelectedData) {
            data.length === selectedData.length ? setSelectedData([]) : setSelectedData(data);
        }
    };

    const handleDelete = () => {
        if (deleteDefinetly) {
            deleteDefinetly(deleteBufferRef.current);
            deleteBufferRef.current = [];
            setDeleteBuffer(deleteBufferRef.current);
        }
    };

    const handleDeleteSelectedUsers = () => {
        if (selectedData) {
            deleteBufferRef.current = [...selectedData];
            setDeleteBuffer(deleteBufferRef.current);
            setToggleClearSelectedRows(!toggleClearSelectedRows);

            toast(<UndoToast undo={undo} />, {
                onClose: handleDelete,
                closeOnClick: false,
            });
        }
    };

    const undo = () => {
        deleteBufferRef.current = [];
        setDeleteBuffer(deleteBufferRef.current);
        setToggleClearSelectedRows(false);
    };

    const updateRow = (key: string) => (newRow: any) => {
        updateTable?.(
            produce(data, (draft) => {
                const i = draft.findIndex((r) => findProps(r, keyColumn) === key);
                if (i >= 0) {
                    draft[i] = newRow;
                }
            }),
        );
    };

    return (
        <DataTableContainer>
            {title && <Title>{title}</Title>}
            <HeaderStyle>
                {hasSearchBar && (
                    <TextInput
                        style={{ width: 400 }}
                        type="text"
                        placeholder={ placeHolderSearchBar || 'Search...' }
                        onChange={(e) =>
                            onChangeSearchBar ? onChangeSearchBar(e.target.value) : setSearchText(e.target.value)}
                    />
                )}
                {page && <div>{page.totalElements} results</div>}
                {deleteDefinetly && (
                    <button disabled={selectedData && selectedData.length === 0} onClick={handleDeleteSelectedUsers}>
                        Delete selected items
                    </button>
                )}
                {actions}
            </HeaderStyle>
            <TableDirectionStyle
                vertical={vertical}
                columns={columns.length}
                isSelectable={selectable}
                isCollapsable={expandable}
            >
                {displayHeader && (
                    <TableRowStyle>
                        {expandable && <TableCellContainer />}
                        {selectable && (
                            <TableCellContainer>
                                <input
                                    type="checkbox"
                                    checked={selectedData && data.length === selectedData.length}
                                    onChange={checkAll}
                                />
                            </TableCellContainer>
                        )}
                        {columns.map((col: DataTableColumn, index) => {
                            if (col.selector) {
                                const colName = col.selector;
                                return (
                                    <TableCellContainer
                                        isHeader
                                        key={col.selector}
                                        onClick={() => handleChangeSort(colName)}
                                    >
                                        {sortedColumn.name === col.selector && <Sorted asc={sortedColumn.asc} />}
                                        <HeaderLabel>{col.name}</HeaderLabel>
                                    </TableCellContainer>
                                );
                            } else {
                                return (
                                    <TableCellContainer isHeader key={index}>
                                        <HeaderLabel>{col.name}</HeaderLabel>
                                    </TableCellContainer>
                                );
                            }
                        })}
                    </TableRowStyle>
                )}

                {!tableIsEmpty &&
                getFilteredData(data, searchText, sortedColumn, toggleClearSelectedRows, selectedData).map(
                    (value) => {
                        const key = findProps(value, keyColumn);
                        return (
                            <TableRow
                                key={key}
                                value={value}
                                selectedData={selectedData}
                                onCheck={onCheck}
                                findProps={findProps}
                                columns={columns}
                                expandable={expandable}
                                expandableComponent={expandableComponent}
                                expandableCondition={expandableCondition?.(value)}
                                selectable={selectable}
                                isEditMode={isEditMode}
                                centerTiles={centerTiles}
                                updateRow={updateRow(key)}
                                transformForExpandable={transformForExpandable}
                            />
                        );
                    },
                )}
                {tableIsEmpty && (
                    <TableRow
                        key={'EmptyRowKey'}
                        value={''}
                        onCheck={onCheck}
                        findProps={findProps}
                        columns={columns}
                        isEmptyRow
                    />
                )}
                {page && setPage && <Paginator page={page} setPage={setPage} />}
            </TableDirectionStyle>
        </DataTableContainer>
    );
};

const TableDirectionStyle = ({
                                 vertical,
                                 ...props
                             }: {
    vertical: boolean;
    columns: number;
    isCollapsable?: boolean;
    isSelectable?: boolean;
    children?: React.ReactNode;
}) => (vertical ? <TableVerticalStyle {...props} /> : <TableStyle {...props} />);

export default DataTable;
