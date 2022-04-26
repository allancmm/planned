import {Button, Select, TextInput, WindowContainer} from 'equisoft-design-ui-elements';
import produce from 'immer';
import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import FileHeader from '../../../components/editor/fileHeader';
import {FileHeaderContainer} from '../../../components/editor/fileHeader/style';
import {TabLoadingContext, useTabActions, useTabWithId} from '../../../components/editor/tabs/tabContext';
import {EDIT_TAB_DATA} from '../../../components/editor/tabs/tabReducerTypes';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import BasicEntity from '../../../lib/domain/entities/basicEntity';
import MapCriteria from '../../../lib/domain/entities/mapCriteria';
import {MG_META_CRITERIA_AS_ROW} from '../../../lib/domain/entities/mapGroup';
import MapHeader, {MAP_VALUE_COL} from '../../../lib/domain/entities/mapHeader';
import MapRow from '../../../lib/domain/entities/mapRow';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import DataTable, {DataTableColumn} from '../../general/dataTable/table';
import {MapActions} from './style';

interface FlatMapRows {
    [criteria: string]: string;
}

const TabMap = ({ tabId }: { tabId: string; }) => {
    const tab = useTabWithId(tabId);
    const { openRightbar } = useContext(RightbarContext);
    const dispatch = useTabActions();
    const [codeCache, setCodeCache] = useState<{ [displayName: string]: BasicEntity[] }>({});
    const { load } = useContext(TabLoadingContext);

    const { data } = tab;
    if (!(data instanceof EntityInformation)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    useEffect(() => {
        if (data.status.status === 'checkOut') fetchCodes();
    }, [data.status.status]);

    const { mapData } = data;

    const fetchCodes = load(async () => {
        const cacheCopy = { ...codeCache };
        for (const header of mapData.headers) {
            if (header.codeList && header.displayName) {
                cacheCopy[header.displayName] = header.codeList
                    .map((code: any[]) => {
                        const basicEntity = new BasicEntity();
                        basicEntity.value = code[0];
                        basicEntity.name = code[1];
                        return basicEntity;
                    });
                setCodeCache(cacheCopy);
            }
        }
    });

    const vertical = mapData.displayOption === MG_META_CRITERIA_AS_ROW;
    const editMode = !data.status.readOnly;

    const ROW_KEY = 'RowGuidKey';
    const flatRows: FlatMapRows[] = mapData.rows.map((r: MapRow) => {
        const baseFlat = r.criteria.reduce((curr: FlatMapRows, c: MapCriteria) => {
            curr[c.mapCriteriaName] = !editMode ? c.displayValue ?? c.textValue : c.textValue;
            return curr;
        }, {});
        baseFlat[MAP_VALUE_COL] = !editMode ? r.displayValue ?? r.valueText : r.valueText;
        baseFlat[ROW_KEY] = r.valueGuid;

        return baseFlat;
    });

    const produceColumnDefinition = (c: MapHeader) => ({
        name: c.displayName ?? c.criteriaName,
        selector: `${c.criteriaName}`,
        forceIsHeader: c.criteriaName === MAP_VALUE_COL,
        cell: (flatRow: FlatMapRows) =>
            editMode ? (
                c.displayName && codeCache[c.displayName] ? (
                    <Select
                        value={flatRow[c.criteriaName]}
                        options={codeCache[c.displayName]?.map((co) => ({ label: co.name, value: co.value })) ?? []}
                        onChange={updateDataForRow(c.criteriaName, flatRow[ROW_KEY])}
                        emptySelectText="Select One"
                    />
                ) : (
                    <TextInput
                        value={flatRow[c.criteriaName]}
                        onChange={updateDataForRow(c.criteriaName, flatRow[ROW_KEY])}
                    />
                )
            ) : (
                flatRow[c.criteriaName]
            ),
    });

    const updateDataForRow = (critName: string, rowGuid: string) => (
        e: ChangeEvent<HTMLSelectElement | HTMLInputElement>,
    ) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    const rowIndex = draft.mapData.rows.findIndex((r) => rowGuid === r.valueGuid);
                    if (critName === MAP_VALUE_COL) {
                        draft.mapData.rows[rowIndex].valueText = e.target.value;
                    } else if (critName !== ROW_KEY) {
                        const critIndex = draft.mapData.rows[rowIndex].criteria.findIndex(
                            (c) => c.mapCriteriaName === critName,
                        );
                        draft.mapData.rows[rowIndex].criteria[critIndex].textValue = e.target.value;
                    }
                }),
            },
        });
    };

    const columns: DataTableColumn[] = mapData.headers
        .filter((h) => h.criteriaName !== MAP_VALUE_COL)
        .map(produceColumnDefinition);

    // value is last if horizontal, but first if vertical
    const valueColumnDefinition: DataTableColumn = mapData.headers
        .filter((h) => h.criteriaName === MAP_VALUE_COL)
        .map(produceColumnDefinition)[0];
    if (valueColumnDefinition) {
        if (!vertical) {
            columns.push(valueColumnDefinition);
        } else {
            columns.unshift(valueColumnDefinition);
        }
    }

    const addRow = () => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    const newRow = new MapRow();
                    newRow.criteria = mapData.rows[0].criteria.map(MapCriteria.clone);
                    draft.mapData.rows.push(newRow);
                }),
            },
        });
    };

    const addCriteria = () => {
        openRightbar('Add_Map_Criteria', tabId);
    };

    return (
        <WindowContainer>
            <FileHeaderContainer>
                <FileHeader tabId={tabId} extrasInformation={<div>{mapData.longDescription}</div>} />
            </FileHeaderContainer>
            <DataTable
                columns={columns}
                data={flatRows}
                keyColumn={ROW_KEY}
                hasSearchBar
                defaultSortColumn={MAP_VALUE_COL}
                isEditMode={editMode}
                updateTable={() => {}}
                vertical={vertical}
                actions={
                    <MapActions>
                        <Button buttonType="tertiary" disabled={data.status.readOnly} onClick={addRow}>
                            + Add Value
                        </Button>
                        <Button buttonType="tertiary" disabled={data.status.readOnly} onClick={addCriteria}>
                            + Add Criteria
                        </Button>
                    </MapActions>
                }
            />
        </WindowContainer>
    );
};

TabMap.defaultProps = {
};

export default TabMap;
