import React, { useContext, useEffect, useState } from 'react';
import TabProvider from '../../components/editor/tabs/tabContext';
import ErrorBoundary from '../../components/general/error/errorBoundary';
import Footer from '../../components/general/footer';
import Header from '../../components/general/header';
import RightBarProvider from '../../components/general/sidebar/rightbarContext';
import SidebarProvider from '../../components/general/sidebar/sidebarContext';
import AppContent from './../app/appContent';
import { useIdleTimer } from 'react-idle-timer'
import StatsService from '../../lib/services/statsService';
import {
    defaultStatsService,
} from '../../lib/context';
import { AuthContext } from '../authContext';
import ActivityTimeEntity from '../../lib/domain/entities/activityTimeEntity';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Wrapper, MainContent } from "./style";

interface AppProps {
    statsService: StatsService;
}

const App = ({ statsService }: AppProps) => {
    const [previousActiveTime, setPreviousActiveTime] = useState<number>(0);
    const { auth } = useContext(AuthContext);

    const environment = auth.oipaEnvironment?.displayName;
    useEffect(() => {
        document.title = `equisoft/design ${environment ? ' - ' + environment : ""}`;
    }, [environment]);

    const handleOnIdle = () => {
        const startTime = getLastActiveTime();
        const activeTime = getTotalActiveTime() - previousActiveTime;
        setPreviousActiveTime(getTotalActiveTime());
        const endTime = getLastActiveTime() + previousActiveTime;

        statsService.logActivityTime(auth.userName, new ActivityTimeEntity(auth.oipaEnvironment?.identifier, new Date(startTime), new Date(endTime), activeTime))
    }

    const { getTotalActiveTime, getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 10,
        onIdle: handleOnIdle,
        debounce: 500
    })


    return (
        <Wrapper>
            <ErrorBoundary canLogout>
                <TabProvider>
                    <SidebarProvider>
                        <RightBarProvider>
                            <Header />
                            <DndProvider backend={HTML5Backend}>
                                <MainContent>
                                    <AppContent />
                                </MainContent>
                            </DndProvider>
                            <Footer />
                        </RightBarProvider>
                    </SidebarProvider>
                </TabProvider>
            </ErrorBoundary>
        </Wrapper>
    );
};

App.defaultProps = {
    statsService: defaultStatsService
}

export default App;
