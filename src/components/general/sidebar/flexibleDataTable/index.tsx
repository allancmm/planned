import { Loading, TextInput, useBetterScrollingList, useCombinedRefs } from 'equisoft-design-ui-elements';
import React, { ReactNode, Ref, useEffect, useRef, useState } from 'react';
import Split from 'react-split-grid';
import Paginator from '../../../../containers/general/dataTable/paginator';
import Pageable from '../../../../lib/domain/util/pageable';
import { FlexibleDataTableRow, FlexibleDataTableRowProps } from './flexibleDataTableRow';
import { FlexibleDataTableGrid, FlexibleDataTableGutter, FlexibleDataTableHeader } from './style';

export const findValue = (obj: any, prop: string): any => {
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

interface FlexibleDataTableProps {
    columns: FlexibleDataTableColumn[];
    data: any[];
    loading?: boolean;
    defaultCursor?: number;
    page?: Pageable;
    searcheable?: boolean;
    checkbox?: boolean;
    rowMapper(r: any, i: number): FlexibleDataTableRowProps;
    setPage?(page: Pageable): void;
    onRowClick?(value: any): void;
}

export interface FlexibleDataTableColumn {
    name: string;
    selector: string;
    cell?(value: any): React.ReactNode;
    format?(value: any): string;
}

type FlexibleDataTableDivProps = FlexibleDataTableProps & React.HTMLAttributes<HTMLDivElement>;

const FlexibleDataTable = React.forwardRef(
    (
        {
            data,
            columns,
            loading = false,
            defaultCursor = -1,
            rowMapper,
            page,
            setPage,
            onRowClick,
            searcheable,
            checkbox,
        }: FlexibleDataTableDivProps,
        ref: Ref<HTMLDivElement>,
    ) => {
        const [cursor, setCursor] = useState(defaultCursor);
        const innerRef = useRef<HTMLDivElement>(null);
        const combinedRef = useCombinedRefs<HTMLDivElement>(innerRef, ref);
        const cursorRef = useRef<HTMLDivElement>(null);

        const [searchText, setSearchText] = useState('');
        const [tableIsEmpty, setTableIsEmpty] = useState(true);

        useEffect(() => {
            setTableIsEmpty(data.length === 0);
        }, [searchText, data]);

        const handleSearch = (d: any[], text: string) => {
            let currentData: any[] = [];
            let newData: any[] = [];

            if (text !== '') {
                currentData = d;

                newData = currentData.filter((anyObject: any) => {
                    let contains = false;

                    columns.forEach((col: FlexibleDataTableColumn) => {
                        if (col.selector) {
                            const lc = findValue(anyObject, col.selector)?.toString()?.toLowerCase();
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

        const getFilteredData = (rawData: any[], search: string) => {
            return handleSearch(rawData, search);
        };

        useBetterScrollingList(combinedRef, cursorRef, [cursor]);

        return (
            <>
                <Loading loading={loading} />

                {!tableIsEmpty ? (
                    <>
                        <Split
                            minSize={100}
                            render={({ getGridProps, getGutterProps }: any) => (
                                <FlexibleDataTableGrid
                                    {...getGridProps()}
                                    tabIndex={0}
                                    aria-activedescendant={`fr-${cursor}`}
                                    role="listbox"
                                    ref={combinedRef}
                                    onBlur={() => setCursor(-1)}
                                    colNumber={columns.length}
                                >
                                    {columns.reduce((acc: ReactNode[], col: FlexibleDataTableColumn, index: number) => {
                                        acc.push(
                                            <FlexibleDataTableHeader key={col.name}>
                                                <span>{col.name}</span>
                                            </FlexibleDataTableHeader>,
                                        );
                                        if (columns.length - 1 !== index) {
                                            acc.push(
                                                <FlexibleDataTableGutter
                                                    key={`gutter-${acc.length}`}
                                                    {...getGutterProps('column', acc.length)}
                                                />,
                                            );
                                        }
                                        return acc;
                                    }, [])}
                                    {getFilteredData(data, searchText)
                                        .map(rowMapper)
                                        .map((r) => (
                                            <FlexibleDataTableRow
                                                id={`fr-${r.id}`}
                                                key={r.id}
                                                selected={r.selected}
                                                columns={r.columns}
                                                value={r.value}
                                                actionBar={r.actionBar}
                                                checkbox={checkbox}
                                                getGutterProps={getGutterProps}
                                                onRowClick={() => onRowClick?.(r.value)}
                                            />
                                        ))}
                                </FlexibleDataTableGrid>
                            )}
                        />
                        {searcheable && (
                            <TextInput
                                style={{ width: 400}}
                                type="text"
                                placeholder="Search..."
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        )}
                        {page && setPage && <Paginator page={page} setPage={setPage} />}
                    </>
                ) : (
                    <div>NO RESULT</div>
                )}
            </>
        );
    },
);

export default FlexibleDataTable;
