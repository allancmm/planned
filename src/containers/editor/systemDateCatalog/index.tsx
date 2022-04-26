import {Grid} from '@material-ui/core';
import { GridPageChangeParams} from '@material-ui/data-grid';
import { DataGrid } from "../../../components/general";
import {Loading, useLoading, WindowContainer} from 'equisoft-design-ui-elements';
import {Button} from '@equisoft/design-elements-react'
import produce from 'immer';
import {toast} from 'react-toastify';
import {useTabActions, useTabWithId} from '../../../components/editor/tabs/tabContext';
import {EDIT_TAB_DATA} from '../../../components/editor/tabs/tabReducerTypes';
import InputText, {Options} from '../../../components/general/inputText';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import {defaultEntitiesService} from '../../../lib/context';
import SystemDateFiltersContainer from '../../../lib/domain/entities/systemDateFiltersContainer';
import SystemDateSession from '../../../lib/domain/entities/tabData/SystemDateSession';
import React, {useContext, useEffect} from 'react';
import EntityService from '../../../lib/services/entitiesService';
import {ButtonLeftSection, ButtonRightSection, SystemDateCatalogContainer, TableContainer} from './style';

const none = ""

const systemDateColumns = [
    {headerName: 'System Date', field: 'systemDate', sortable: false, flex: 0.8},
    {headerName: 'Business Day', field: 'businessDayIndicator', sortable: false, flex: 0.8},
    {headerName: 'Current', field: 'currentIndicator', sortable: false, flex: 0.5},
    {headerName: 'Month End', field: 'monthEndIndicator', sortable: false, flex: 0.7},
    {headerName: 'Quarter End', field: 'quarterEndIndicator', sortable: false, flex: 0.7},
    {headerName: 'Year End', field: 'yearEndIndicator', sortable: false, flex: 0.7},
    {headerName: 'Next System Date', field: 'nextSystemDate', sortable: false, flex: 1},
    {headerName: 'Previous System Date', field: 'previousSystemDate', sortable: false, flex: 1},
    {headerName: 'Calendar Code', field: 'calendarCode', sortable: false, flex: 0.8}
];

interface SystemDateCatalogProps {
    tabId: string;
    entitiesService: EntityService
}

const SystemDateCatalog = ({tabId, entitiesService}: SystemDateCatalogProps) => {
    const tab = useTabWithId(tabId);
    const {data} = tab;
    const dispatch = useTabActions();

    if (!(data instanceof SystemDateSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const { openRightbar, closeRightbar } = useContext(RightbarContext);
    const [pageSize, setPageSize] = React.useState<number>(25);
    const [ loading, load ] = useLoading();

    const fetchSystemDateFilters = () => {
        load(async () => {
           const container: SystemDateFiltersContainer = await entitiesService.getSystemDateFilters();
            dispatch({
                type: EDIT_TAB_DATA,
                payload: {
                    tabId,
                    data: produce(data, (draft) => {
                        draft.systemDateFiltersContainer.months = container.months;
                        draft.systemDateFiltersContainer.years = container.years;
                        draft.systemDateFiltersContainer.calendarCodes = container.calendarCodes;
                    }),
                },
            });
        })();
    };

    useEffect(() => {
        fetchSystemDateFilters();
    }, []);


    const handlePageSizeChange = (params: GridPageChangeParams) => {
        setPageSize(params.pageSize);
    };

    const filterSystemDates =  load (async () => {
        const systemDatesList = await entitiesService.getSystemDates(data.systemDateFiltersContainer.selectedMonth,
            data.systemDateFiltersContainer.selectedYear, data.systemDateFiltersContainer.selectedCalendarCode);
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.systemDates = systemDatesList;
                }),
            },
        });
    })

    const renderSelect = (labelName: string, items: string[], selectedValue: string, handleChange: Function) => {
        const options = [new Options("None", none)].concat(items.map( i => new Options(i.toString(), i.toString())))
        return <InputText
            label={labelName}
            options={options}
            type='select'
            defaultValue={none}
            value={selectedValue}
            onChange={handleChange}
        />
    };

    const renderCalendarCode = () => {
        const options = [new Options("None", none)]
            .concat(data.systemDateFiltersContainer.calendarCodes.map( c => new Options(c.longDescription, c.value)))
        return <InputText
            label={'Calendar Code'}
            options={options}
            type='select'
            defaultValue={none}
            value={data.systemDateFiltersContainer.selectedCalendarCode}
            onChange={(e: Options) => {
                dispatch({
                    type: EDIT_TAB_DATA,
                    payload: {
                        tabId,
                        data: produce(data, (draft) => {
                            draft.systemDateFiltersContainer.selectedCalendarCode = e.value;
                        }),
                    },
                });
            }}
        />
    }

    const onClickCreateSystemDate = () => {
        openRightbar('Create_System_Date', { callback: () => {
                toast.success('System date created successfully');
                fetchSystemDateFilters();
                filterSystemDates();
                closeRightbar();
            }});
    };

    return (
        <WindowContainer>
            <Loading loading={loading} />
            <SystemDateCatalogContainer>
                <Grid container spacing={3}>
                    <Grid item xs={2}>
                        {renderSelect('Year', data.systemDateFiltersContainer.years,
                            data.systemDateFiltersContainer.selectedYear,
                            (e: Options) =>  {
                                dispatch({
                                    type: EDIT_TAB_DATA,
                                    payload: {
                                        tabId,
                                        data: produce(data, (draft) => {
                                            draft.systemDateFiltersContainer.selectedYear = e.value;
                                        }),
                                    },
                                });
                            })
                        }
                    </Grid>
                    <Grid item xs={2}>
                    {renderSelect('Month', data.systemDateFiltersContainer.months,
                        data.systemDateFiltersContainer.selectedMonth,
                        (e: Options) =>  {
                            dispatch({
                                type: EDIT_TAB_DATA,
                                payload: {
                                    tabId,
                                    data: produce(data, (draft) => {
                                        draft.systemDateFiltersContainer.selectedMonth = e.value;
                                    }),
                                },
                            });
                        })
                    }
                    </Grid>
                    <Grid item xs={2}>
                    {renderCalendarCode()}
                    </Grid>
                    <Grid item xs={3}>
                        <ButtonLeftSection>
                            <Button buttonType="secondary" type="button" label="Search" onClick={filterSystemDates}/>
                        </ButtonLeftSection>
                    </Grid>
                    <Grid item xs={3}>
                        <ButtonRightSection>
                            <Button buttonType="primary" type="button" label="Create System Dates" onClick={onClickCreateSystemDate} />
                        </ButtonRightSection>
                    </Grid>
                </Grid>
                <TableContainer>
                    <DataGrid
                        density="compact"
                        id='id'
                        pageSize={pageSize}
                        onPageSizeChange={handlePageSizeChange}
                        rowsPerPageOptions={[25, 50, 100]}
                        columns={systemDateColumns}
                        rows={data.systemDates}
                        disableSelectionOnClick
                        disableColumnFilter
                    />
                </TableContainer>
            </SystemDateCatalogContainer>
        </WindowContainer>
    );
};

SystemDateCatalog.defaultProps = {
    entitiesService: defaultEntitiesService
};

export default SystemDateCatalog;