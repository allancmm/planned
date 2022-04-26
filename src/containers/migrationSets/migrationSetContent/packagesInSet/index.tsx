import React from 'react';
import ConfigPackage from '../../../../lib/domain/entities/configPackage';
import DataGrid, {TitleDataGrid} from "../../../../components/general/dataGrid";
import {GridCellParams, GridColumns} from "@material-ui/data-grid";
import {dateToString} from "../../../../lib/util/date";
import { MigrationSetTableContainer } from "../style";

const columns: GridColumns = [
    {
        headerName: 'Package Name',
        field: 'packageName',
        flex: 1,
    },
    {
        headerName: 'Modified By',
        field: 'lastModifiedBy',
        flex: 1,
    },
    {
        headerName: 'Modified At',
        field: 'lastModifiedAt',
        renderCell: ({ row }: GridCellParams) => <>{dateToString(row.lastModifiedAt, 'MM/dd/yyyy HH:mm:ss')}</>,
        flex: 1,
    },
]

const PackagesInSet = ({ pkgs }: { pkgs: ConfigPackage[] }) => {
    return (
        <MigrationSetTableContainer numberElementsTab={pkgs.length}>
           <TitleDataGrid value='Packages' />
           <DataGrid
                id='packageGuid'
                columns={columns}
                rows={pkgs}
                rowCount={pkgs.length}
            />
        </MigrationSetTableContainer>
    );
};

export default PackagesInSet;
