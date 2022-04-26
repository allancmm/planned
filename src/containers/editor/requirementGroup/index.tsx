import { format } from 'date-fns';
import { Button, DateInput, Select, WindowContainer } from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, { ChangeEvent, useEffect } from 'react';
import { toast } from 'react-toastify';
import FileHeader from '../../../components/editor/fileHeader';
import { FileHeaderContainer } from '../../../components/editor/fileHeader/style';
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA } from '../../../components/editor/tabs/tabReducerTypes';
import RequirementCriterion from '../../../lib/domain/entities/requirementCriterion';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import { CriterionCodeEnum } from '../../../lib/domain/enums/criterionValueCode';
import DataTable, { DataTableColumn } from '../../general/dataTable/table';

const TabRequirementGroup = ({ tabId }: { tabId: string }) => {
    const tab = useTabWithId(tabId);
    const dispatch = useTabActions();

    const { data } = tab;
    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const { criteria } = data;

    useEffect(() => criteria.forEach((criterion) => (criterion.changeToken = false)), [data.status]);

    const onTypeCodeChange = (row: RequirementCriterion) => (e: ChangeEvent<HTMLSelectElement>) => {
        e.preventDefault();
        const tabDataCriteria = criteria.map((c) => {
            if (c.rowID === row.rowID) {
                c.typeCode = e.target.value;
            }
            return c;
        });
        handleTableChange(tabDataCriteria);
    };

    const typeCodeCell = (row: RequirementCriterion): React.ReactNode => {
        return !data.status.readOnly ? (
            <Select
                onChange={onTypeCodeChange(row)}
                options={CriterionCodeEnum.codes.map((c) => ({ label: c.value, value: c.code }))}
                emptySelectText={'Please Select'}
                value={row.typeCode}
                required
            />
        ) : (
            row.typeCode
        );
    };

    const onDateValueChange = (row: RequirementCriterion, d: Date) => {
        const tabDataCriteria = criteria.map((c) => {
            if (c.rowID === row.rowID) {
                c.dateValue = d;
            }
            return c;
        });
        handleTableChange(tabDataCriteria);
    };

    const dateValueCell = (row: RequirementCriterion): React.ReactNode => {
        return !data.status.readOnly ? (
            <DateInput selected={row.dateValue} onChange={(d) => onDateValueChange(row, d as Date)} />
        ) : (
            <div>{row.dateValue ? format(row.dateValue, 'yyyy-MM-dd') : ''}</div>
        );
    };

    const columns: DataTableColumn[] = [
        { name: 'Criteria Name', selector: 'criteriaName' },
        { name: 'Type Code', selector: 'typeCode', cell: typeCodeCell },
        { name: 'Date Value', selector: 'dateValue', cell: dateValueCell },
        { name: 'Text Value', selector: 'textValue' },
        { name: 'Int Value', selector: 'intValue' },
        { name: 'Float Value', selector: 'floatValue' },
        { name: 'Currency Code', selector: 'currencyCode' },
    ];

    const handleTableChange = (newCriteria: RequirementCriterion[]) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.criteria = newCriteria;
                }),
            },
        });
    };

    const addRow = () => {
        if (!data.status.readOnly) {
            handleTableChange(
                produce(criteria, (draft) => {
                    draft.push(new RequirementCriterion());
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
                data={criteria}
                keyColumn={'rowID'}
                defaultSortColumn={'criteriaName'}
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

export default TabRequirementGroup;
