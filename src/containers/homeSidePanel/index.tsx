import { format } from 'date-fns';
import { Button, CollapseContainer, Loading, useLoading } from 'equisoft-design-ui-elements';
import React, { useContext, useEffect, useState } from 'react';
import { useTabActions } from '../../components/editor/tabs/tabContext';
import { OPEN } from '../../components/editor/tabs/tabReducerTypes';
import TypeBadge from '../../components/general/sidebar/entitySummary/entityTypeBadge';
import { SidebarContext } from '../../components/general/sidebar/sidebarContext';
import { PanelTitle } from '../../components/general/sidebar/style';
import { defaultEntityInformationService, defaultStatsService } from '../../lib/context';
import DisplayableStatInfos from '../../lib/domain/entities/displayableStatInfos';
import DisplayableStatInfosList from '../../lib/domain/entities/displayableStatInfosList';
import { EntityType } from '../../lib/domain/enums/entityType';
import Pageable from '../../lib/domain/util/pageable';
import EntityInformationService from '../../lib/services/entityInformationService';
import StatsService from '../../lib/services/statsService';
import { AuthContext } from '../../page/authContext';
import { DataTableColumn } from '../general/dataTable/table';
import { Container, NameSection, Panel, PanelGrid } from './style';
import NoRecordsFound from "../../components/general/noRecordsFound";

interface UserStatisticsProps {
    statsService: StatsService;
    entityInformationService: EntityInformationService;
}

const UserStatistics = ({ statsService, entityInformationService }: UserStatisticsProps) => {
    const SEVEN_DAYS_AGO = 7;

    const [loadingRA, loadRA] = useLoading();
    const [loadingLC, loadLC] = useLoading();

    const { auth } = useContext(AuthContext);
    const [recentActivities, setRecentActivities] = useState<DisplayableStatInfosList>(new DisplayableStatInfosList());
    const [lockCheckoutInfos, setLockCheckoutInfos] = useState<DisplayableStatInfosList>(
        new DisplayableStatInfosList(),
    );

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - SEVEN_DAYS_AGO);
    const endDate = new Date();
    const dispatch = useTabActions();
    const { refreshSidebar } = useContext(SidebarContext);

    useEffect(() => {
        init();
    }, [refreshSidebar]);

    const init = loadLC(
        loadRA(async () => {
            setRecentActivities(
                await statsService.getRecentActivities(
                    [auth.userName],
                    auth.oipaEnvironment?.identifier ?? '',
                    startDate,
                    endDate,
                    new Pageable(),
                    true,
                ),
            );
            setLockCheckoutInfos(
                await statsService.getLockCheckOut(
                    [auth.userName],
                    auth.oipaEnvironment?.identifier ?? '',
                    startDate,
                    endDate,
                    new Pageable(),
                ),
            );
        }),
    );

    const displayableInfosColumns: DataTableColumn[] = [
        {
            name: 'Activities',
            cell: (row: DisplayableStatInfos) => {
                return (
                    <Button
                        type="button"
                        buttonType="tertiary"
                        onClick={() => redirect(row.entityType, row.elementGuid)}
                    >
                        {format(row.date, 'dd-MM-yyy HH:mm:ss')} - {row.activityType}
                        <NameSection>
                            {row.entityType && row.elementName ? (
                                <>
                                    {' - '}
                                    <TypeBadge type={row.entityType} /> {row.elementName}
                                </>
                            ) : (
                                ''
                            )}
                        </NameSection>
                    </Button>
                );
            },
            selector: 'compactedData',
        },
    ];

    const redirect = async (entityType: EntityType, elementGuid: string) => {
        const entityInformation = await entityInformationService.getEntityInformation(
            entityType,
            elementGuid,
            'DEFAULT',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
    };

    const renderRecentActivitiesPanel = () =>
            <CollapseContainer title='Recent Activities' defaultOpened>
                <>
                    <Loading loading={loadingRA} />
                    {recentActivities.infos.length > 0 ?
                        <PanelGrid
                            columns={displayableInfosColumns}
                            data={recentActivities.infos}
                            keyColumn={'guid'}
                            displayHeader={false}
                            hasSearchBar={false}
                        /> :
                        <NoRecordsFound />
                    }
                </>
            </CollapseContainer>

    const renderLockedCheckOutPanel = () =>
            <CollapseContainer title='Locked/Checked out' defaultOpened>
                <>
                    <Loading loading={loadingLC} />
                    {lockCheckoutInfos.infos.length > 0 ?
                        <PanelGrid
                            columns={displayableInfosColumns}
                            data={lockCheckoutInfos.infos}
                            keyColumn='guid'
                            page={lockCheckoutInfos.page}
                            setPage={loadLC(async (newPage) =>
                                setLockCheckoutInfos(
                                    await statsService.getLockCheckOut(
                                        [auth.userName],
                                        auth.oipaEnvironment?.identifier ?? '',
                                        startDate,
                                        endDate,
                                        newPage,
                                    ),
                                ),
                            )}
                            displayHeader={false}
                            hasSearchBar={false}
                        /> :
                        <NoRecordsFound />
                    }
                </>
            </CollapseContainer>

    return (
        <>
            <PanelTitle>Welcome {auth.userName}</PanelTitle>
            <Container>
                <Panel>{renderRecentActivitiesPanel()}</Panel>
                <Panel>{renderLockedCheckOutPanel()}</Panel>
            </Container>
        </>
    );
};

UserStatistics.defaultProps = {
    statsService: defaultStatsService,
    entityInformationService: defaultEntityInformationService,
};

export default UserStatistics;
