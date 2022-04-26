import { Button, WindowContainer } from 'equisoft-design-ui-elements';
import produce from 'immer';
import React from 'react';
import { toast } from 'react-toastify';
import FileHeader from '../../../components/editor/fileHeader';
import { FileHeaderContainer } from '../../../components/editor/fileHeader/style';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA } from '../../../components/editor/tabs/tabReducerTypes';
import ErrorCatalog from '../../../lib/domain/entities/errorCatalog';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import DataTable, { DataTableColumn } from '../../general/dataTable/table';

const TabErrorCatalog = ({ tabId }: { tabId: string }) => {
    const tab = useTabWithId(tabId);
    const dispatch = useTabActions();

    const { data } = tab;
    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const { errorCatalogs } = data;

    const columns: DataTableColumn[] = [
        { name: 'Error Number', selector: 'errorNumber' },
        { name: 'Error Message', selector: 'errorMessage' },
        { name: 'Error FixTip', selector: 'errorFixTip' },
    ];

    const handleTableChange = (newErrorCatalogs: ErrorCatalog[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.errorCatalogs = newErrorCatalogs;
                }),
            },
        });
    };

    const addRow = () => {
        if (!data.status.readOnly) {
            handleTableChange(
                produce(errorCatalogs, (draft) => {
                    draft.push(new ErrorCatalog());
                }),
            );
        }
    };

    return (
        <WindowContainer>
            <FileHeaderContainer>
                <FileHeader tabId={tabId} />
            </FileHeaderContainer>
            <DataTable
                columns={columns}
                data={errorCatalogs}
                keyColumn={'rowID'}
                defaultSortColumn={'errorNumber'}
                hasSearchBar
                isEditMode={!data.status.readOnly}
                updateTable={handleTableChange}
                actions={
                    <Button buttonType="tertiary" disabled={data.status.readOnly} onClick={addRow}>
                        + Add Row
                    </Button>
                }
            />
        </WindowContainer>
    );
};

export default TabErrorCatalog;
