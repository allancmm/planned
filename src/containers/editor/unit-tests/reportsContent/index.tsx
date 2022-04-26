import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { dateToString } from "../../../../lib/util/date";
import { testStatusToDisplayName } from "../../../../lib/domain/enums/testStatusType";
import { UnitTestContainer } from "../style";
import { TestReportResult } from "../../../../lib/domain/entities/testReportResult";
import {
    GridCellParams, GridColumns, GridResizeParams,
    GridValueGetterParams,
} from "@material-ui/data-grid";
import DataGrid, { getSearchRegex } from "../../../../components/general/dataGrid";
import { compareDesc } from 'date-fns'

interface ReportsContentProps {
    testReport: TestReportResult[],
    onClickItem(test: TestReportResult) : void,
}

const ReportsContent = ({ testReport, onClickItem } : ReportsContentProps) => {
    const dataGridRef = useRef<HTMLDivElement>(null);

    const [rows, setRows] = useState<TestReportResult[]>([]);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [searchText, setSearchText] = useState('');

    useEffect(() => setRows([...testReport.sort((a, b) =>
        compareDesc(a.runDate, b.runDate) )]), [testReport]);

    useLayoutEffect(() => {
        setContainerSize({ width: dataGridRef?.current?.offsetWidth || 0, height: dataGridRef?.current?.offsetHeight || 0})
    }, [dataGridRef]);

    const handleOnClick = ({ row } : GridCellParams) => {
        onClickItem(row as TestReportResult);
    };

    const columns: GridColumns = [
        { field: 'testResult.name',
            headerName: 'Test Suite',
            description: 'Test Suite Name',
            flex: 1,
            editable: false,
            valueGetter: ({ row }: GridValueGetterParams) => row.testResult.name,
        },
        { field: 'runBy',
            headerName: 'Run By',
            description: 'Run By',
            flex: 0.75,
            editable: false,
            hide: containerSize.width < 400,
        },
        { field: 'runDate',
            headerName: 'Run date',
            description: 'Run date',
            flex: 0.75,
            editable: false,
            hide: containerSize.width < 500,
            valueGetter: ({ row }: GridValueGetterParams) => dateToString(row.runDate)
        },
        { field: 'status',
            headerName: 'Status',
            description: 'Test Suite Status',
            flex: 0.75,
            editable: false,
            hide: containerSize.width < 200,
            valueGetter: ({ row } : GridValueGetterParams) => testStatusToDisplayName(row.status),
        }];

    const requestSearch = (searchValue: string) => {
        setSearchText(searchValue);
        const searchRegex = getSearchRegex(searchValue);
        const filteredRows = testReport.filter((row: TestReportResult) => {
            return Object.keys(row).some((field) => {
                switch (field) {
                    case 'testResult':
                        return searchRegex.test(row.testResult.name);
                    case 'status':
                        return searchRegex.test(testStatusToDisplayName(row.status));
                    case 'runDate':
                        return searchRegex.test(dateToString(row.runDate));
                    case 'runBy':
                        return searchRegex.test(row.runBy);
                    default: return null;
                }
            });
        });
        setRows(filteredRows);
    };
    return (
        <UnitTestContainer>
            <div className='data-grid-report-container' ref={dataGridRef}>
                <DataGrid
                    id='unitTestReportGuid'
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    onCellClick={handleOnClick}
                    onResize={(param : GridResizeParams) => {
                        param.containerSize && setContainerSize(param.containerSize);
                    }}
                    searchText={searchText}
                    requestSearch={requestSearch}
                    isShowInputFilter
                />
            </div>
        </UnitTestContainer>
    );
}

export default ReportsContent;

