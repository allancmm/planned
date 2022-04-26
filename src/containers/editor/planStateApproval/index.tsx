import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {IconButton} from '@material-ui/core';
import {format} from "date-fns";
import {Button} from '@equisoft/design-elements-react';
import {DateInput, Select, Dialog, useDialog, WindowContainer} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {v4 as uuid} from 'uuid';
import FileHeader from '../../../components/editor/fileHeader';
import {FileHeaderContainer} from '../../../components/editor/fileHeader/style';
import {useTabActions, useTabWithId} from '../../../components/editor/tabs/tabContext';
import {EDIT_TAB_DATA} from '../../../components/editor/tabs/tabReducerTypes';
import {defaultEntitiesService} from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import PlanStateApproval from '../../../lib/domain/entities/planStateApproval';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import DataTable, {DataTableColumn} from '../../general/dataTable/table';
import {ActionIcon} from '../../packagingControl/style';
import {CellText} from '../code/style';

const STATE_CODES = `AsCodeState`;
const entityService = defaultEntitiesService;

const PlanStateApprovalTab = ({ tabId }: { tabId: string }) => {
    const tab = useTabWithId(tabId);
    const dispatch = useTabActions();
    const [dialogProps, setDialogProps] = useState({});
    const [allStateCodes, setAllStateCodes] = useState<BasicEntity[]>([]);
    const [show, toggle] = useDialog();
    const {data} = tab;

    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const {planStateApprovals} = data;

    useEffect(() => { entityService.getCodes(STATE_CODES).then(setAllStateCodes) }, []);
    useEffect(() => planStateApprovals.forEach(s => s.changeToken = false), [data.status]);

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

    const onConfirmDeletion = async (planStateApproval: PlanStateApproval) => {
        if (!data.status.readOnly) {
            handleTableChange(planStateApprovals.filter((s) => s !== planStateApproval));
        }
    };

    const stateCodeCell = (row: PlanStateApproval):React.ReactNode => {
        return !data.status.readOnly ?
            <Select onChange={onStateChange(row)} options={allStateCodes.map((s) => ({ label: s.name, value: s.value }))} value={row.stateCode} />
            : allStateCodes.length > 0 ? allStateCodes.filter(s => s.value === row.stateCode)[0].name : row.stateCode
    };

    const onStateChange = (row: PlanStateApproval) => (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const planStateApprovalTab = planStateApprovals.map(s => {
            if(s.stateApprovalGuid === row.stateApprovalGuid) {
                s.stateCode = e.target.value;
            }
            return s;
        })
        handleTableChange(planStateApprovalTab);
    }

    const effectiveDateCell = (row: PlanStateApproval): React.ReactNode => {
        return (!data.status.readOnly) ?
            <DateInput selected={row.effectiveDate} onChange={(d) => onDateChange(row, d as Date, 'EFFECTIVE_DATE')} />
            : <div>{row.effectiveDate ? format(row.effectiveDate, 'yyyy-MM-dd') : ''}</div>;
    };

    const expirationDateCell = (row: PlanStateApproval): React.ReactNode => {
        return (!data.status.readOnly) ?
            <DateInput selected={row.expirationDate} onChange={(d) => onDateChange(row, d as Date, 'EXPIRATION_DATE')} />
            : <div>{row.expirationDate ? format(row.expirationDate, 'yyyy-MM-dd') : ''}</div>;
    };

    const onDateChange = (row: PlanStateApproval, date: Date, typeDate: string) => {
        const planStateApprovalTab = planStateApprovals.map(
            s => {
                if (s.stateApprovalGuid === row.stateApprovalGuid) {
                    switch(typeDate) {
                        case 'EFFECTIVE_DATE':
                            s.effectiveDate = date;
                            break;
                        case 'EXPIRATION_DATE':
                            s.expirationDate = date;
                            break;
                    }
                }
                return s;
            }
        )
        handleTableChange(planStateApprovalTab);
    }

    const columns: DataTableColumn[] = [
        {name: 'State Code', selector: 'stateCode', cell: stateCodeCell },
        {name: 'Effective Date', selector: 'effectiveDate', cell: effectiveDateCell },
        {name: 'Expiration Date', selector: 'expirationDate', cell: expirationDateCell },
        {name: 'Action', cell: (planStateApproval: PlanStateApproval) => {
                return data.status.readOnly ? <CellText/> :
                    <IconButton aria-label="delete" size="small"
                                onClick={ () => openDialog(<div>Are you sure you want to delete this code row?</div>,
                                    () => onConfirmDeletion(planStateApproval))}>
                        <ActionIcon  icon={ faTrashAlt } />
                    </IconButton>;
            }
        },
    ];

    const handleTableChange = (newPlanStateApprovals: PlanStateApproval[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.planStateApprovals = newPlanStateApprovals;
                }),
            },
        });
    };

    const addRow = () => {
        if (!data.status.readOnly) {
            handleTableChange(
                produce(planStateApprovals, (draft) => {
                    const p = new PlanStateApproval();
                    p.stateApprovalGuid= uuid();
                    p.planGuid = data.getGuid();
                    p.isNew = true;
                    draft.push(p);
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
                data={planStateApprovals}
                keyColumn='stateApprovalGuid'
                defaultSortColumn='stateCode'
                sortDesc
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
}

export default PlanStateApprovalTab;