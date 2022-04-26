import {FormControlLabel} from '@material-ui/core';
import produce from 'immer';
import Switch from '../../../components/general/switch';
import ChartOfAccountsResult from "../../../lib/domain/entities/chartOfAccountsResult";
import React, {ChangeEvent} from 'react';
import Insert from "../../../lib/domain/enums/yesNo";
import DataTable, { DataTableColumn } from '../../general/dataTable/table';
import { WindowContainer } from "equisoft-design-ui-elements";

interface ResultSectionProps {
    results: ChartOfAccountsResult[];
    isEditMode: boolean;
    ruleGuid: string,
    updateResults(newResults: ChartOfAccountsResult[]): void;
}

export const ResultSection = ({ isEditMode, updateResults, results }: ResultSectionProps) => {

    const onChangeSwitch = (event: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
        updateResults(produce(results, (draft) => {
            const i = draft.findIndex((e) => e.rowID === rowId);
            if(i >= 0){
                draft[i] = {...draft[i], insert: event.target.checked ? Insert.Yes : Insert.No}
            }
        }));
    };

    const insertCell = (result: ChartOfAccountsResult) =>
        <FormControlLabel
            control={
                <Switch checked={result.insert === Insert.Yes}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => onChangeSwitch(event, result.rowID)}
                        name='insertSwitch' color='primary'
                        disabled={!isEditMode}
                />
            }
            label={result.insert}
        />;

    const dataTableColumns: DataTableColumn[] = [
        {
            name: 'Result Name',
            selector: 'resultName',
            isUnmodifiable: true
        },
        {
            name: 'Insert',
            cell: insertCell
        },
    ];

    return (
        <WindowContainer>
            <DataTable
                columns={dataTableColumns}
                data={results}
                keyColumn={'resultName'}
                hasSearchBar={false}
                isEditMode={isEditMode}
                updateTable={updateResults}
            />
        </WindowContainer>

    );
};

export default ResultSection;

