import React, { ChangeEvent, MouseEvent } from "react";
import { DataGrid as DataGridMaterial, GridCellParams, GridColumns, GridRowsProp } from "@material-ui/data-grid";
import QuickSearchToolbar from "../quickSearchToolbar";
import { DataGridContainer, TitleContainer} from "./style";
import { useTheme } from "../hooks";

interface DataGridProps {
    id: string,
    rows: GridRowsProp,
    columns: GridColumns,
    pageSize?: number,
    isShowToolbarFilter?: boolean,
    isShowInputFilter?: boolean,
    searchText?: string,
    showMenuIcon?: boolean,
    onCellClick(params: GridCellParams, event: MouseEvent) : void,
    requestSearch?(value: string) : void,
}

type DataGridType = DataGridProps & React.HTMLAttributes<HTMLDivElement> & any;

const DataGrid = ({ id,
                    rows,
                    columns,
                    pageSize = 5,
                    onCellClick,
                    isShowToolbarFilter = false,
                    isShowInputFilter = false,
                    searchText = '',
                    showMenuIcon = false,
                    requestSearch = () => {},
                    ...props } : DataGridType) => {

    const { isLightTheme, currentTheme } = useTheme();

    const getComponent = () : any =>
        isShowToolbarFilter || isShowInputFilter ?
            { ...{ components: { Toolbar: QuickSearchToolbar },
                    ...{ componentsProps: {
                            toolbar: {
                                value: searchText,
                                onChange: (event: ChangeEvent<HTMLInputElement>) => requestSearch(event.target.value),
                                clearSearch: () => requestSearch(''),
                                isShowToolbarFilter,
                                isShowInputFilter
                            }
                        }}
                }
            } : {};


    return (
        <DataGridContainer
            sx={{
                // @ts-ignore
                "& .MuiDataGrid-root .MuiDataGrid-columnHeader .MuiDataGrid-iconButtonContainer": {
                    width: "auto",
                    visibility: "visible"
                },
                "& .MuiDataGrid-root .MuiDataGrid-columnHeader:not(.MuiDataGrid-columnHeader--sorted) .MuiDataGrid-sortIcon": {
                    opacity: 0.5
                },
                "& .MuiDataGrid-iconButtonContainer": {
                   padding: '0 0 var(--spacing-half) var(--spacing-1x)'
                },
                "& .MuiDataGrid-sortIcon": {
                    color: isLightTheme ? 'unset' : currentTheme.colors.text.primary
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 'var(--font-semi-bold) !important',
                    color: 'unset',
                    fontFamily: 'var(--font-family)',
                    letterSpacing: '.025rem',
                },
                "& .MuiDataGrid-row": {
                    cursor: onCellClick ? 'pointer' : 'unset'
                },
                "& .MuiDataGrid-root": {
                    border: 'none',
                    fontFamily: 'var(--font-family)',
                    color: 'unset',
                },
                "& .MuiTablePagination-toolbar": {
                    color: isLightTheme ? "unset" : "var(--c-white)"
                },
                "& .MuiIconButton-label": {
                    color: isLightTheme ? "unset" : "var(--c-white)"
                },
                "& .MuiSelect-icon": {
                    color: isLightTheme ? "unset" : "var(--c-white)"
                },
                "& .MuiFormControlLabel-label.Mui-disabled": {
                    color: isLightTheme ? "unset" : "var(--c-white)"
                },
                ...(showMenuIcon ?
                    {"& .MuiDataGrid-menuIconButton": {
                            opacity: 1,
                            visibility: "visible"
                        }
                    } : {})
            }}
        >
            <DataGridMaterial
                density="compact"
                getRowId={(row) => row[id]}
                rows={rows}
                columns={columns}
                pageSize={pageSize}
                hideFooterSelectedRowCount
                onCellClick={onCellClick}
                {...getComponent()}
                {...props}
            />
        </DataGridContainer>
    );
}

export default DataGrid;

const escapeRegExp = (value: string): string => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const getSearchRegex = (searchValue: string) => new RegExp(escapeRegExp(searchValue), 'i');

export const TitleDataGrid = ({ value } : {value: string }) => <TitleContainer>{value}</TitleContainer>

export const CellDataGrid = ({ value } :  { value: string }) => <span title={value}>{value}</span>;

const HEIGHT_DATA_GRID_ROW = 35;
const HEIGHT_HEADER_FOOTER = 120;
const MIN_HEIGHT_DATA_GRID = 150;
export const calcHeightDataGrid = (numberItems: number) => Math.max(numberItems * HEIGHT_DATA_GRID_ROW + HEIGHT_HEADER_FOOTER, MIN_HEIGHT_DATA_GRID);

export { DataGridContent, DataGridWrapper } from "./style";
