import React, { useContext, useEffect } from 'react';
import { format } from 'date-fns';
import { Button, CollapseContainer, Loading, useLoading, WindowContainer } from 'equisoft-design-ui-elements';
import { Grid } from "@material-ui/core";
import produce from 'immer';
import { useTabActions, useTabWithId } from '../../components/editor/tabs/tabContext';
import { EDIT_TAB_DATA, OPEN } from '../../components/editor/tabs/tabReducerTypes';
import { defaultEntityInformationService, defaultStatsService, defaultOipaUserService } from '../../lib/context';
import DisplayableStatInfos from '../../lib/domain/entities/displayableStatInfos';
import StatsHeaderData from '../../lib/domain/entities/statsHeaderData';
import UserStatisticsData from '../../lib/domain/entities/tabData/userStatisticsData';
import Pageable from '../../lib/domain/util/pageable';
import StatsService from '../../lib/services/statsService';
import OipaUserService from '../../lib/services/oipaUserService';
import { AuthContext } from '../../page/authContext';
import { DataTableColumn } from '../general/dataTable/table';
import PanelHeader from './panelHeader/panelHeader';
import EntityInformationService from '../../lib/services/entityInformationService';
import {
    BodyContainer,
    Panel,
    PanelGrid, HeaderContainer, PanelGridContainer
} from './style';
import { CustomCard } from "../../components/general";
import { EntityType } from '../../lib/domain/enums/entityType';
import ColumnChart from './columnChart/columnChart';
import ActionStat from '../../lib/domain/entities/actionStat';
import GraphData from "../../lib/domain/entities/graphInfo";
import DisplayableStatInfosList from "../../lib/domain/entities/displayableStatInfosList";
import useStyles from "./useStyles";

const STATUS_FULFILLED = 'fulfilled';

interface UserStatisticsProps {
    tabId: string;
    oipaUserService: OipaUserService;
    statsService: StatsService;
    entityInformationService: EntityInformationService;
}

const SubDataTable = ({ data, column }: { data?: ActionStat, column: DataTableColumn[] }) => <PanelGrid
    columns={column}
    data={data?.children ?? []}
    keyColumn={'guid'}
    hasSearchBar={false}
    centerTiles
/>

const UserStatistics = ({ tabId, oipaUserService, statsService, entityInformationService }: UserStatisticsProps) => {
    const [loading, load] = useLoading();
    const { auth } = useContext(AuthContext);
    const session = useTabWithId(tabId).data as UserStatisticsData;
    const dispatch = useTabActions();
    const { customCardStyles } = useStyles();
    const {
        usernames,
        firstTimeLoad,
        recentActivities,
        lockCheckoutInfos,
        actionStats,
        graphStats,
        statsHeaderData
    } = session

    useEffect(() => {
        firstTimeLoad && init()
    }, [])

    const init = async () => {
        const developUsernames = await load(oipaUserService.getAllDevelopUsernames)();
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(session, (draft) => {
                    draft.usernames = developUsernames;
                    draft.firstTimeLoad = false;
                }),
            },
        });
    };

    const displayableInfosColumns: DataTableColumn[] = [
        {
            name: 'Username',
            selector: 'username',
        },
        {
            name: 'Activity Type',
            selector: 'activityType',
        },
        {
            name: 'Date',
            cell: (row: DisplayableStatInfos) => {
                return (
                    <div>{format(row.date, 'MM/dd/yyyy HH:mm:ss')}</div>
                )
            },
            selector: 'date',
        },
        {
            name: 'Element Type',
            cell: (row: DisplayableStatInfos) => {
                return (
                    <Button type="button" buttonType="tertiary" onClick={() => redirect(row.entityType, row.elementGuid)}>
                        {row.elementType}
                    </Button>
                )
            },
            selector: 'elementType',
        },
    ]

    const getActionStatsColumn = (typeName: string): DataTableColumn[] => {
        return [
            {
                name: typeName,
                selector: 'type',
            },
            {
                name: 'Count',
                selector: 'count',
            }
        ]
    }

    const redirect = async (entityType: EntityType, elementGuid: string) => {
        const entityInformation = await entityInformationService.getEntityInformation(
            entityType,
            elementGuid,
            'DEFAULT',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
    }

    const renderRecentActivitiesPanel = () => {
        return (
            <CollapseContainer title={'Activity Logs'} defaultOpened>
                <PanelGridContainer>
                    <PanelGrid
                        columns={displayableInfosColumns}
                        data={recentActivities.infos}
                        keyColumn={'guid'}
                        page={recentActivities.page}
                        setPage={fetchRecentActivities}
                        centerTiles
                    />
                </PanelGridContainer>
            </CollapseContainer>
        );
    }

    const fetchRecentActivities = async (newPage: Pageable) => {
        const activities = await statsService.getRecentActivities(statsHeaderData.selectedUsernames.map(s => s.name),
            auth.oipaEnvironment?.identifier ?? '', statsHeaderData.start, statsHeaderData.end, newPage);
        recentActivities.page.totalElements = recentActivities.page.totalElements;
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(session, (draft) => {
                    draft.recentActivities = activities
                }),
            },
        });
    };

    const renderLockedCheckOutPanel = () => {
        return (
            <CollapseContainer title={'Locked/Checked out'} defaultOpened>
                <PanelGridContainer>
                    <PanelGrid
                        columns={displayableInfosColumns}
                        data={lockCheckoutInfos.infos}
                        keyColumn={'guid'}
                        page={lockCheckoutInfos.page}
                        setPage={fetchLockCheckout}
                        centerTiles
                    />
                </PanelGridContainer>
            </CollapseContainer>
        );
    }

    const fetchLockCheckout = async (newPage: Pageable) => {
        const lockAndCheckouts = await statsService.getLockCheckOut(statsHeaderData.selectedUsernames.map(s => s.name),
            auth.oipaEnvironment?.identifier ?? '', statsHeaderData.start, statsHeaderData.end, newPage);
        lockCheckoutInfos.page.totalElements = lockAndCheckouts.page.totalElements;
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(session, (draft) => {
                    draft.lockCheckoutInfos = lockAndCheckouts
                }),
            },
        });
    };

    const renderActionStatsPanel = () => {
        return (
            <CollapseContainer title={'Statistics'} defaultOpened>
                <PanelGridContainer>
                    <PanelGrid
                        columns={getActionStatsColumn("Action Type")}
                        data={actionStats}
                        keyColumn={'guid'}
                        centerTiles
                        expandable
                        expandableComponent={<SubDataTable column={getActionStatsColumn("Entity Type")} />}
                        expandableCondition={(value) => value.children}
                    />
                </PanelGridContainer>
            </CollapseContainer>
        );
    }

    const renderGraphPanel = () => {
        return (
            <CollapseContainer title={'Logging time vs Activity time'} defaultOpened>
                <ColumnChart
                    title='Logging time vs Activity time'
                    yAxistitle='Total time (HH:MM:SS)'
                    graphCategories={graphStats.categories}
                    graphSeries={[{
                        type: 'column',
                        name: 'Logged Time',
                        data: graphStats.loggedTimeData
                    }, {
                        type: 'column',
                        name: 'Activity Time',
                        data: graphStats.activityTimeData
                    }]}
                />
            </CollapseContainer>
        );
    }

    const updateSession = (value: StatsHeaderData) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(session, (draft) => {
                    draft.statsHeaderData = value;
                }),
            },
        });
    };

    const fetchPanelData = async (apiRequest: Function, headerData: StatsHeaderData, page?: Pageable) =>
        apiRequest(headerData.selectedUsernames.map(su => su.name), auth.oipaEnvironment?.identifier ?? '', headerData.start, headerData.end, page);


    const refreshAllPanels = async (statsData: StatsHeaderData) => {
        if (statsData.selectedUsernames.length > 0) {
            const [recentActivitiesResp, lockCheckoutInfosResp, actionStatsResp, graphStatsResp] = await Promise.allSettled([
                fetchPanelData(load(statsService.getRecentActivities), statsData, recentActivities.page),
                fetchPanelData(load(statsService.getLockCheckOut), statsData, lockCheckoutInfos.page),
                fetchPanelData(load(statsService.getActionStats), statsData),
                fetchPanelData(load(statsService.getGraphData), statsData)
            ]);

            dispatch({
                type: EDIT_TAB_DATA,
                payload: {
                    tabId,
                    data: produce(session, (draft) => {
                        draft.recentActivities = recentActivitiesResp.status === STATUS_FULFILLED ? recentActivitiesResp.value : new DisplayableStatInfosList();
                        draft.lockCheckoutInfos = lockCheckoutInfosResp.status === STATUS_FULFILLED ? lockCheckoutInfosResp.value : new DisplayableStatInfosList();
                        draft.actionStats = actionStatsResp.status === STATUS_FULFILLED ? actionStatsResp.value : [];
                        draft.graphStats = graphStatsResp.status === STATUS_FULFILLED ? graphStatsResp.value : new GraphData();
                    }),
                },
            });
        }
    }

    return (
        <WindowContainer>
            <Loading loading={loading} />
            <HeaderContainer>
                <CustomCard className={customCardStyles}>
                    <PanelHeader
                        data={statsHeaderData}
                        setHeaderData={updateSession}
                        selectableFields={usernames.map(u => ({ name: u, displayName: u }))}
                        refreshPanel={() => refreshAllPanels(statsHeaderData)}
                    />
                </CustomCard>
            </HeaderContainer>
            <BodyContainer>
                <Grid container spacing={1}>
                    <Grid item sm={12}>
                        <Panel>{renderRecentActivitiesPanel()}</Panel>
                    </Grid>
                    <Grid item sm={6}>
                        <Panel>{renderLockedCheckOutPanel()}</Panel>
                    </Grid>
                    <Grid item sm={6}>
                        <Panel>{renderActionStatsPanel()}</Panel>
                    </Grid>
                    <Grid item sm={12}>
                        <Panel>{renderGraphPanel()}</Panel>
                    </Grid>
                </Grid>
            </BodyContainer>
        </WindowContainer>
    );
};

UserStatistics.defaultProps = {
    oipaUserService: defaultOipaUserService,
    statsService: defaultStatsService,
    entityInformationService: defaultEntityInformationService
}

export default UserStatistics;
