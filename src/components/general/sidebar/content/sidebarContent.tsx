import { Loading } from 'equisoft-design-ui-elements';
import React, { useContext } from 'react';
import ErrorBoundary from '../../error/errorBoundary';
import { SidebarContext } from '../sidebarContext';
import { PanelContent } from '../style';

const HomePanel = React.lazy(() => import(/* webpackChunkName: "HomePanel" */ '../../../../containers/homeSidePanel'));

const SearchPanel = React.lazy(
    () => import(/* webpackChunkName: "SearchPanel" */ '../../../../containers/search/searchRules'),
);

const ExplorerPanel = React.lazy(
    () => import(/* webpackChunkName: "ExplorerPanel" */ '../../../../containers/explorer'),
);

const PackagingControlPanel = React.lazy(
    () => import(/* webpackChunkName: "PackagingControlPanel" */ '../../../../containers/packagingControl'),
);

const GitPanel = React.lazy(
    () => import(/* webpackChunkName: "ReleasePanel" */ '../../../../containers/git'),
);

const DebuggerPanel = React.lazy(
    () => import(/* webpackChunkName: "DebuggerPanel" */ '../../../../containers/editor/debugger/debuggerPanel'),
);

const UnitTestPanel = React.lazy(
    () => import(/* webpackChunkName: "UnitTest" */ '../../../../containers/editor/unit-tests'),
);

const FunctionTestPanel = React.lazy(
    () => import(/* webpackChunkName: "FunctionTestPanel" */ '../../../../containers/functionalTest'),
);

const DataManagementPanel = React.lazy(
    () => import(/* webpackChunkName: "DataManagementPanel" */ '../../../../containers/dataManagement'),
);

const AdministrationPanel = React.lazy(
    () => import(/* webpackChunkName: "DataManagementPanel" */ '../../../../containers/administration'),
);

const SidebarContent = () => {
    const { sidebarType } = useContext(SidebarContext);
    return (
        <PanelContent>
            {(() => {
                switch (sidebarType) {
                    case 'Home':
                        return <HomePanel />;
                    case 'Search':
                        return <SearchPanel />;
                    case 'Explorer':
                        return <ExplorerPanel />;
                    case 'Package':
                        return <PackagingControlPanel />;
                    case 'Git':
                        return <GitPanel />;
                    case 'Debug':
                        return <DebuggerPanel />;
                    case 'Function':
                        return <FunctionTestPanel />;
                    case 'DataManagement':
                        return <DataManagementPanel />;
                    case 'UnitTests':
                        return <UnitTestPanel />;
                    case 'Administration':
                        return <AdministrationPanel />;
                    case '':
                        return <></>;
                }
            })()}
        </PanelContent>
    );
};

export default (props: any) => (
    <React.Suspense fallback={<Loading />}>
        <ErrorBoundary>
            <SidebarContent {...props} />
        </ErrorBoundary>
    </React.Suspense>
);
