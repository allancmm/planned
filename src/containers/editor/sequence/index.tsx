import { format } from 'date-fns';
import { Button, DateInput, WindowContainer } from 'equisoft-design-ui-elements';
import produce from 'immer';
import React from 'react';
import { toast } from 'react-toastify';
import FileHeader from '../../../components/editor/fileHeader';
import { FileHeaderContainer } from '../../../components/editor/fileHeader/style';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA } from '../../../components/editor/tabs/tabReducerTypes';
import Sequence from '../../../lib/domain/entities/sequence';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import DataTable, { DataTableColumn } from '../../general/dataTable/table';

const SequenceCatalog = ({ tabId }: { tabId: string }) => {
    const tab = useTabWithId(tabId);
    const dispatch = useTabActions();
    const { data } = tab;
    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const { sequences } = data;

    const columns: DataTableColumn[] = [
        { name: 'Sequence Name', selector: 'sequenceName' },
        { name: 'Sequence Integer', selector: 'sequenceInteger' },
        {
            name: 'Sequence Date',
            cell: (row: Sequence) => {
                return data.status.readOnly ? (
                    <div>{row.sequenceDate ? format(row.sequenceDate, 'MM/dd/yyyy HH:mm:ss') : ''}</div>
                ) : (
                    <DateInput selected={row.sequenceDate} onChange={(d) => handleSequenceChange(row, d as Date)} />
                );
            },
            selector: 'sequenceDate',
        },
        { name: 'Sequence Description', selector: 'sequenceDescription' },
        { name: 'DataBase Sequence Name', selector: 'databaseSequenceName' },
    ];

    const handleSequenceChange = (row: Sequence, date: Date) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.sequences.forEach((sequence: Sequence) => {
                        if (sequence.rowID === row.rowID) {
                            sequence.sequenceDate = date;
                        }
                    });
                }),
            },
        });
    };

    const handleTableChange = (newSequence: Sequence[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.sequences = newSequence;
                }),
            },
        });
    };

    const addRow = () => {
        if (!data.status.readOnly) {
            handleTableChange(
                produce(sequences, (draft) => {
                    draft.push(new Sequence());
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
                data={sequences}
                keyColumn={'rowID'}
                defaultSortColumn={'sequenceName'}
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

export default SequenceCatalog;
