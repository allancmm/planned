import React from 'react';
import Version from '../../../lib/domain/entities/version';
import DataGrid, { TitleDataGrid } from "../../../components/general/dataGrid";
import { GridCellParams, GridColumns } from "@material-ui/data-grid";
import { dateToString } from "../../../lib/util/date";
import { MigrationSetTableContainer } from "./style";
import { TextEllipsis } from "../../../components/general";

const columns: GridColumns = [
    {
        headerName: 'Version',
        field: 'versionNumber',
        flex: 0.5,
    },
    {
        headerName: 'Rule Name',
        field: 'ruleName',
        flex: 1,
        renderCell: ({row}) => <>{row.rule.ruleName}</>
    },
    {
        headerName: 'From Package',
        field: 'fromPackageName',
        flex: 1,
    },
    {
        headerName: 'Override',
        field: 'overrideName',
        flex: 1,
        renderCell: ({row}) =>
            <TextEllipsis title={row.rule.override.overrideName}>
                {row.rule.override.overrideName}
            </TextEllipsis>
    },
    {
        headerName: 'Modified By',
        field: 'lastModifiedBy',
        flex: 1,
    },
    {
        headerName: 'Modified At',
        field: 'lastModifiedAt',
        flex: 1,
        renderCell: ({row}: GridCellParams) => <>{dateToString(row.lastModifiedAt, 'MM/dd/yyyy HH:mm:ss')}</>,
    },
];

const VersionInSet = ({ versions }: { versions: Version[] }) => {
    return (
        <MigrationSetTableContainer numberElementsTab={versions.length}>
            <TitleDataGrid value='Versions' />
            <DataGrid
                id='versionGuid'
                columns={columns}
                rows={versions}
                rowCount={versions.length}
            />
        </MigrationSetTableContainer>
    );
};

export default VersionInSet;
