import {Button, Select, WindowContainer} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {ChangeEvent, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import FileHeader from '../../../components/editor/fileHeader';
import {FileHeaderContainer} from '../../../components/editor/fileHeader/style';
import {useTabActions, useTabWithId} from '../../../components/editor/tabs/tabContext';
import {EDIT_TAB_DATA} from '../../../components/editor/tabs/tabReducerTypes';
import {defaultEntitiesService} from '../../../lib/context';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import WorkflowQueueRole from '../../../lib/domain/entities/workflowQueueRole';
import DataTable, {DataTableColumn} from '../../general/dataTable/table';

const TabWorkflowQueueRole = ({ tabId }: { tabId: string }) => {
    const WORKFLOW_QUEUE_CODES = `AsCodeWorkflowQueue`;
    const WORKFLOW_ROLE_CODES = `AsCodeWorkflowRole`;
    const tab = useTabWithId(tabId);
    const dispatch = useTabActions();
    const entityService = defaultEntitiesService;

    const [allWorkflowQueueCodes, setAllWorkflowQueueCodes] = useState<BasicEntity[]>([]);
    const [allWorkflowRoleCodes, setAllWorkflowRoleCodes] = useState<BasicEntity[]>([]);

    const {data} = tab;
    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const {workflowQueueRoles} = data;

    useEffect(() => { entityService.getCodes(WORKFLOW_QUEUE_CODES).then(setAllWorkflowQueueCodes) }, []);
    useEffect(() => { entityService.getCodes(WORKFLOW_ROLE_CODES).then(setAllWorkflowRoleCodes) }, []);
    useEffect(() => workflowQueueRoles.forEach(w => w.changeToken = false), [data.status]);

    const workflowQueueCodeCell = (row: WorkflowQueueRole):React.ReactNode => {
        return !data.status.readOnly ? <Select
            onChange={onWorkflowQueueCodeChange(row)}
            options={allWorkflowQueueCodes.map((c) => ({ label: c.name, value: c.value }))}
            emptySelectText={'Please Select'}
            value={row.workflowQueueCode}
            required
        /> : allWorkflowQueueCodes.filter(c => c.value === row.workflowQueueCode).map(c => c.name);
    };

    const workflowRoleCodeCell = (row: WorkflowQueueRole):React.ReactNode => {
        return !data.status.readOnly ? <Select
            onChange={onWorkflowRoleCodeChange(row)}
            options={allWorkflowRoleCodes.map((c) => ({ label: c.name, value: c.value }))}
            emptySelectText={'Please Select'}
            value={row.workflowRoleCode}
            required
        /> : allWorkflowRoleCodes.filter(c => c.value === row.workflowRoleCode).map(c => c.name);
    };

    const columns: DataTableColumn[] = [
        {name: 'Workflow Queue Name', selector: 'workflowQueueCode', cell:workflowQueueCodeCell},
        {name: 'Workflow Role Name', selector: 'workflowRoleCode', cell:workflowRoleCodeCell}
    ];

    const onWorkflowQueueCodeChange = (row: WorkflowQueueRole) => (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const TabDataWorkflowQueueRole = workflowQueueRoles.map(
            w => {
                if(w.rowID === row.rowID){
                    w.workflowQueueCode = e.target.value
                }
                return w;
            }
        )
        handleTableChange(TabDataWorkflowQueueRole);
    }

    const onWorkflowRoleCodeChange = (row: WorkflowQueueRole) => (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const TabDataWorkflowQueueRole = workflowQueueRoles.map(
            w => {
                if(w.rowID === row.rowID){
                    w.workflowRoleCode = e.target.value
                }
                return w;
            }
        )
        handleTableChange(TabDataWorkflowQueueRole);
    }

    const handleTableChange = (newWorkflowQueueRoles: WorkflowQueueRole[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.workflowQueueRoles = newWorkflowQueueRoles;
                }),
            },
        });
    };

    const addRow = () => {
        if (!data.status.readOnly) {
            handleTableChange(
                produce(workflowQueueRoles, (draft) => {
                    draft.push(new WorkflowQueueRole());
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
                data={workflowQueueRoles}
                keyColumn={'rowID'}
                defaultSortColumn={'workflowQueueCode'}
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

export default TabWorkflowQueueRole;