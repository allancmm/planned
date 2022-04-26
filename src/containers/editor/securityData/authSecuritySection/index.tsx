import React, { useState } from 'react';
import { Loading, Select } from 'equisoft-design-ui-elements';
import AuthSecurity from '../../../../lib/domain/entities/authSecurity';
import { GridCellParams, GridColumns, GridPageChangeParams, GridRowModel } from '@material-ui/data-grid';
import { DataGrid, Options } from "../../../../components/general";
import { DataGridContainer, SecurityDataContent } from "../style";

interface AuthSecuritySectionProp {
    authSecurities: AuthSecurity[];
    isEditMode: boolean;
    loading: boolean;
    authCodeLevelOptions: Options[],
    handleLevelCodeChange(id: string, name: string, value: string): void,
}

const AuthSecuritySection = ({ authSecurities,
                               isEditMode,
                               loading,
                               authCodeLevelOptions,
                               handleLevelCodeChange,
                             } : AuthSecuritySectionProp) => {
    const [pageSize, setPageSize] = useState<number>(authSecurities.length);

    const handlePageSizeChange = (params: GridPageChangeParams) => {
        setPageSize(params.pageSize);
    };

    const onAuthSecurityLevelCodeChange = (row: GridRowModel) => (event: React.ChangeEvent<HTMLSelectElement>): void => {
        handleLevelCodeChange(row.id, row.name, event.target.value);
    }

    const columns: GridColumns = [
        { field: 'name', headerName: 'Name', description: 'Name', flex: 1, editable: false },
        {
            field: 'securityLevelCode',
            headerName: 'Security Level',
            description: 'Security level code',
            flex: 1,
            editable: false,
            renderCell: (params: GridCellParams) =>
                <Select
                    onChange={onAuthSecurityLevelCodeChange(params.row)}
                    value={params.row.securityLevelCode}
                    options={authCodeLevelOptions}
                    disabled={!isEditMode || loading }
                />,
        }
    ];

    return(
        <>
            <Loading loading={loading} />
             <SecurityDataContent>
                <DataGridContainer>
                    <DataGrid
                        id='id'
                        rows={authSecurities}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        rowsPerPageOptions={[10, 20, 50]}
                        disableSelectionOnClick
                        showColumnRightBorder={false}
                    />
                </DataGridContainer>
            </SecurityDataContent>
        </>
    );
}

AuthSecuritySection.defaultProps = {};

export default AuthSecuritySection;