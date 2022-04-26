import produce, { Draft } from 'immer';
import React, { useMemo, useState } from 'react';
import { ISidebarData } from '../../../lib/domain/entities/sidebarData/iSidebarData';
import { SidebarDataFactory } from '../../../lib/domain/entities/sidebarData/iSidebarDataUtils';

export type SidebarDataStore = { [type in SidebarType]?: ISidebarData };
export interface SidebarContextProps {
    sidebarSize: number;
    refreshSidebar: boolean;
    sidebarType: SidebarType;

    data: SidebarDataStore;
    editSidebarData<T extends ISidebarData>(recipe: (draft: Draft<T>) => void, type?: SidebarType): void;
    getDataForSidebar(st: SidebarType): ISidebarData;
    openSidebar(type?: SidebarType): void;
    closeSidebar(): void;
    setSidebarSize(size: number): void;
    toggleRefreshSidebar(): void;
}

export const SIDEBAR_MIN_SIZE = 15;
const defaultSidebar: SidebarContextProps = {
    sidebarSize: SIDEBAR_MIN_SIZE, // %
    openSidebar: () => {},
    closeSidebar: () => {},
    sidebarType: '',
    setSidebarSize: () => {},
    refreshSidebar: false,
    toggleRefreshSidebar: () => {},
    data: {},
    editSidebarData: () => {},
    getDataForSidebar: () => new ISidebarData(),
};

export const SidebarContext = React.createContext<SidebarContextProps>(defaultSidebar);
export type SidebarType =
    | 'Home'
    | 'Search'
    | 'Explorer'
    | 'Package'
    | 'Git'
    | 'Debug'
    | 'UnitTests'
    | 'Function'
    | 'DataManagement'
    | 'Administration'
    | '';

const SidebarProvider = (props: any) => {
    const [sidebarSize, setSidebarSize] = useState(20);
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const [sidebarType, setSidebarType] = useState<SidebarType>('');
    const [refreshSidebar, setRefreshSidebar] = useState(false);
    const [data, setData] = useState<SidebarDataStore>({});

    const openSidebar = (type?: SidebarType) => {
        if (sidebarIsOpen && type === sidebarType) {
            closeSidebar();
            return;
        }

        setSidebarIsOpen(true);
        if (sidebarSize < SIDEBAR_MIN_SIZE) {
            setSidebarSize(SIDEBAR_MIN_SIZE);
        }
        if (type) {
            setSidebarType(type);
            if (!data[type]) {
                setData(
                    produce(data, (draft) => {
                        draft[type] = SidebarDataFactory(type);
                    }),
                );
            }
        }
    };

    const closeSidebar = () => {
        setSidebarIsOpen(false);
    };

    const editSidebarData = <T extends ISidebarData>(recipe: (draft: Draft<T>) => void, type?: SidebarType) => {
        const sidebarData = produce(data, (draft) => {
            draft[type ?? sidebarType] = produce(draft[type ?? sidebarType], recipe);
        });
        setData(sidebarData);
    };

    const getDataForSidebar = (st: SidebarType) => data[st];

    const context = useMemo(
        () => ({
            openSidebar,
            closeSidebar,
            sidebarSize: sidebarIsOpen ? sidebarSize : 0,
            sidebarType,
            setSidebarSize,
            refreshSidebar,
            data: data[sidebarType],
            editSidebarData,
            getDataForSidebar,
            toggleRefreshSidebar: () => setRefreshSidebar((prevState) => !prevState),
        }),
        [
            sidebarSize,
            sidebarIsOpen,
            setSidebarSize,
            sidebarType,
            refreshSidebar,
            openSidebar,
            closeSidebar,
            setData,
            editSidebarData,
            getDataForSidebar,
        ],
    );

    return <SidebarContext.Provider value={context} {...props} />;
};

export default SidebarProvider;
