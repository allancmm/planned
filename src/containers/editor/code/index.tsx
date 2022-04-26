import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {IconButton} from '@material-ui/core';
import {Button, Dialog, TextInput, useDialog, WindowContainer} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {ReactNode, useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import FileHeader from '../../../components/editor/fileHeader';
import { FileHeaderContainer } from '../../../components/editor/fileHeader/style';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA } from '../../../components/editor/tabs/tabReducerTypes';
import Code from '../../../lib/domain/entities/code';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import DataTable, { DataTableColumn } from '../../general/dataTable/table';
import {ActionIcon} from '../../packagingControl/style';
import {CellText} from './style';

const TabCode = ({ tabId }: { tabId: string }) => {
    const tab = useTabWithId(tabId);
    const dispatch = useTabActions();
    const [dialogProps, setDialogProps] = useState({});
    const [show, toggle] = useDialog();
    const {data} = tab;

    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const {codes} = data;

    useEffect(() => codes.forEach(code => code.changeToken = false), [data.status]);

    const openDialog = (element: ReactNode, onConfirm: () => void) => {
        toggle();
        setDialogProps({
            element,
            onConfirm,
        });
    };

    const closeDialog = () => {
        toggle();
        setDialogProps({});
    };

    const getDialogProps = () => {
        return {
            show,
            onClose: closeDialog,
            title: 'Confirmation Required',
            confirmPanel: true,
            element: <></>,
            ...dialogProps,
        };
    };

    const onConfirmDeletion = async (code: Code) => {
        if (!data.status.readOnly) {
            handleTableChange(codes.filter((c) => c !== code));
        }
    };

    const columns: DataTableColumn[] = [
        {name: 'Code Value', selector: 'value'},
        {name: 'Short Description', selector: 'shortDescription'},
        {name: 'Long Description', selector: 'longDescription'},
        {name: 'System Indicator', cell: (code: Code) => {
                return data.status.readOnly || (code.systemIndicator === 'Y' && !code.changeToken) ?
                    <CellText><span>{code.systemIndicator}</span></CellText> :
                    <TextInput type="text" value={code.systemIndicator} maxLength={1}
                               onChange={(e) => handleSystemIndicatorCellChange(code, e.target.value)} />;
            }
        },
        {name: 'Action', cell: (code: Code) => {
                return data.status.readOnly || (code.systemIndicator === 'Y' && !code.changeToken) ? <CellText/> :
                    <IconButton aria-label="delete" size="small"
                                onClick={ () => openDialog(<div>Are you sure you want to delete this code row?</div>, () => onConfirmDeletion(code))}>
                        <ActionIcon  icon={ faTrashAlt } />
                    </IconButton>;
            }
        },
    ];

    const handleTableChange = (newCodes: Code[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.codes = newCodes;
                }),
            },
        });
    };

    const handleSystemIndicatorCellChange = (code: Code, systemIndicator: string) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    const codeIndex = draft.codes.findIndex((c) => c.rowID === code.rowID);
                    draft.codes[codeIndex].systemIndicator = systemIndicator;
                    draft.codes[codeIndex].changeToken = true;
                }),
            },
        });
    }

    const addRow = () => {
        if (!data.status.readOnly) {
            handleTableChange(
                produce(codes, (draft) => {
                    draft.push(new Code());
                }),
            );
        }
    };

    return (
        <WindowContainer>
            <Dialog {...getDialogProps()} />
            <FileHeaderContainer>
                <FileHeader tabId={tabId} />
            </FileHeaderContainer>
            <DataTable
                columns={columns}
                data={codes}
                keyColumn={'rowID'}
                defaultSortColumn={'shortDescription'}
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

export default TabCode;
