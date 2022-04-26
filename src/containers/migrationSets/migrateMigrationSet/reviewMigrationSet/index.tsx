import React from 'react';
import MigrateReview, { VersionConflictStatus } from '../../../../lib/domain/entities/migrateReview';
import { DataGrid, calcHeightDataGrid, DataGridContent, CellDataGrid } from "../../../../components/general";
import {GridColumns} from "@material-ui/data-grid";
import { StatusContainer } from "./styles";
import {Icon} from "@equisoft/design-elements-react";

const getDataStatus = (status: VersionConflictStatus) => {
    switch (status) {
        case 'CONFLICT':
            return { icon: <Icon name='alertTriangle' size={16} />, background: 'rgb(205, 44, 35)', description: 'Conflict'};
        case 'OK':
            return { icon: <Icon name='check' size={16} />, background: 'rgb(0, 133, 51)', description: 'Success'};
        case 'WARNING':
            return { icon: <Icon name='helpCircle' size={16} />, background: 'rgb(245, 162, 0)', description: 'Warning'};
        default:
            return { icon: <Icon name='helpCircle' size={16} />, background: 'rgb(96, 102, 110)', description: status};
    }
};

const columns: GridColumns = [
    {
        headerName: 'Rule Name',
        field: 'ruleName',
        flex: 1,
        renderCell: ({ row }) => <CellDataGrid value={row.rule.ruleName} />,
    },
    {
        headerName: 'Override',
        field: 'overrideName',
        flex: 1,
        renderCell: ({ row }) => <CellDataGrid value={row.rule.override.overrideName} />,
    },
    {
        headerName: 'Version Package',
        field: 'versionInPackage',
        flex: 1,
    },
    {
        headerName: 'Target Version',
        field: 'versionInTarget',
        flex: 1,
    },
    {
        headerName: 'Config Package',
        field: 'fromConfigPackageName',
        flex: 1,
        renderCell: ({ row }) => <CellDataGrid value={row.fromConfigPackageName} />,

    },
    {
        headerName: 'Migration Set',
        field: 'fromMigrationSetName',
        flex: 1,
        renderCell: ({ row }) => <CellDataGrid value={row.fromMigrationSetName} />,
    },
    {
        headerName: 'Status',
        field: 'status',
        flex: 0.5,
        renderCell: ({ row }) => {
            const { icon, background, description } = getDataStatus(row.status);
            return <StatusContainer background={background}>
                {icon}
                <span>{description}</span>
            </StatusContainer>;
        },
    },
];

const ReviewMigrationSet = ({ reviews }: { reviews: MigrateReview[] }) =>
        <DataGridContent height={calcHeightDataGrid(reviews.length)}>
            <DataGrid
               id={'versionGuid'}
               rows={reviews}
               columns={columns}
               disableColumnMenu
            />
        </DataGridContent>;

export default ReviewMigrationSet;