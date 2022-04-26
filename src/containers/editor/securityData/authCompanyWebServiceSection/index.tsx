import React, {ChangeEvent, useEffect, useState} from 'react';
import { Loading } from 'equisoft-design-ui-elements';
import { GridCellParams, GridColumns, GridPageChangeParams } from '@material-ui/data-grid';
import { DataGrid } from "../../../../components/general";
import {AccessAllContent, DataGridContainer, SecurityDataContent} from "../style";
import AuthCompanyWebService from "../../../../lib/domain/entities/authCompanyWebService";
import {FormControlLabel} from "@material-ui/core";
import Switch from "../../../../components/general/switch";
import Access from "../../../../lib/domain/enums/yesNo";
import InputText from "../../../../components/general/inputText";

interface AuthCompanyWebServiceSectionProps {
    authCompanyWebServices: AuthCompanyWebService[];
    isEditMode: boolean;
    loading: boolean;
    handleAccessChange(webServiceName: string, hasAccess: boolean, grantAccessAll?: boolean): void,
}

const AuthCompanyWebServiceSection = ({ authCompanyWebServices,
                                 isEditMode,
                                 loading,
                                 handleAccessChange,
                             } : AuthCompanyWebServiceSectionProps) => {
    const [pageSize, setPageSize] = useState<number>(authCompanyWebServices.length);
    const [accessAll, setAccessAll] = useState<boolean>(false);

    useEffect(() => {
        if(authCompanyWebServices.length > 0){
            setAccessAll(!authCompanyWebServices.find((a) => a.access !== Access.Yes));
        } else setAccessAll(false);
    }, [authCompanyWebServices]);

    const handlePageSizeChange = (params: GridPageChangeParams) => {
        setPageSize(params.pageSize);
    };

    const renderAccess = ({ row } : GridCellParams) =>
        <FormControlLabel
            control={
                <Switch checked={row.access === Access.Yes}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => handleAccessChange(row.webServiceName, event.target.checked)}
                        name='accessSwitch' color='primary'
                        disabled={!isEditMode || loading }
                />
            }
            label={row.access}
        />;

    const columns: GridColumns = [
        { field: 'webServiceName', headerName: 'WebService Name', description: 'WebService Name', flex: 1, editable: false },
        {
            field: 'access',
            headerName: 'Access',
            description: 'Access',
            flex: 1,
            editable: false,
            renderCell: renderAccess,
        }
    ];

    const onChangeAccessAll = ({ target: { checked }} : ChangeEvent<HTMLInputElement>) => {
        setAccessAll(checked);
        checked && handleAccessChange('',  false, checked);
    }

    const disableGrantAccessAll = () => !isEditMode || loading || authCompanyWebServices.length === 0;

    return(
        <SecurityDataContent>
            <Loading loading={loading} />

            <AccessAllContent>
                <InputText
                    type='checkbox'
                    options={[{ label: 'Grant access all', value: 'accessAll', disabled: disableGrantAccessAll() }]}
                    checkedValues={[accessAll ? 'accessAll' : '']}
                    onChange={onChangeAccessAll}
                    disabled={disableGrantAccessAll()}
                />
            </AccessAllContent>

            <DataGridContainer>
                <DataGrid
                    id="id"
                    rows={authCompanyWebServices}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    rowsPerPageOptions={[10, 20, 50]}
                    disableSelectionOnClick
                    showColumnRightBorder={false}
                />
            </DataGridContainer>
        </SecurityDataContent>
    );
}

AuthCompanyWebServiceSection.defaultProps = {};

export default AuthCompanyWebServiceSection;