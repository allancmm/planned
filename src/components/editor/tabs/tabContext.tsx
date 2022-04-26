import { classToPlain, plainToClass } from 'class-transformer';
import { LoadMethod, noOpLoad, useLoading } from 'equisoft-design-ui-elements';
import localforage from 'localforage';
import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import { useImmerReducer } from "use-immer";
import { AuthContext } from '../../../page/authContext';
import tabReducer from './tabReducer';
import { Cache, LayoutItem, LOAD_STORE, Store, TabActions, TabItem } from './tabReducerTypes';
import { useModal } from '@equisoft/design-elements-react';

export const LOCAL_STORAGE_KEY = 'tabContext';
interface TabItemsContext {
    refreshTab: boolean;
    useConfirmClose: { isModalOpen: boolean, openModal: Function, closeModal: Function };
    toggleRefreshTab: Function;
    state: Store;
    dispatch({}: TabActions): void;
}

const noopTabContext: TabItemsContext =
    { state: new Store(),
      dispatch: () => {},
      refreshTab: false,
      useConfirmClose: { isModalOpen: false, openModal: () => null, closeModal: () => null },
      toggleRefreshTab: () => null};

export const TabContext = createContext(noopTabContext);

export const TabLoadingContext = createContext<{
    load: LoadMethod;
    loading: boolean;
}>({
    load: noOpLoad,
    loading: false,
});

export const useLayoutWithId = (layoutId: number): LayoutItem => {
    const {
        state: { layouts },
    } = useContext(TabContext);
    return layouts[layoutId];
};

export const useTabWithId = (tabId: string): TabItem => {
    const {
        state: { tabs },
    } = useContext(TabContext);
    return tabs[tabId];
};

export const useTabsWithGUID = (guid: string): TabItem[] => {
    const {
        state: { tabs },
    } = useContext(TabContext);
    return Object.values(tabs).filter((t) => t.data.getGuid() === guid);
};

export const useTabActions = () => {
    const { dispatch } = useContext(TabContext);
    return dispatch;
};

export const useFocusedActiveTab = (): [number, string] => {
    const {
        state: { layouts, focusLayout },
    } = useContext(TabContext);
    return [focusLayout, layouts[focusLayout]?.active];
};

const TabProvider = (props: any) => {
    const { auth, isAuthenticated } = useContext(AuthContext);
    const [loading, load] = useLoading();
    const [state, dispatch] = useImmerReducer(tabReducer, new Store());
    const [refreshTab, setRefreshTab] = useState(false);

    const { isModalOpen, openModal, closeModal } = useModal();

    useEffect(() => {
        initFromCache();
    }, []);

    const initFromCache = async () => {
        const localState = await localforage.getItem(LOCAL_STORAGE_KEY);
        let localStore: Cache | null = null;
        if (localState) {
            const parsed: Cache = plainToClass(Cache, localState, { groups: ['cache'] });
            if (parsed.matchesAuthContext(auth)) {
                localStore = parsed;
            } else {
                // someone else store, destroy
                await localforage.removeItem(LOCAL_STORAGE_KEY);
            }
        }

        if (!localStore) {
            localStore = new Cache(auth, new Store());
        }

        dispatch({ type: LOAD_STORE, payload: { store: localStore.store } });
    };

    const context = useMemo(
        () => (
            { state,
              dispatch,
              refreshTab,
              useConfirmClose: { isModalOpen, openModal, closeModal},
              toggleRefreshTab: () => setRefreshTab((prevState) => !prevState)}),
        [state, dispatch, refreshTab, isModalOpen]);

    useEffect(() => {
        saveStateInCache();
    }, [state]);

    const saveStateInCache = async () => {
        if (isAuthenticated === 'YES') {
            const c = classToPlain(new Cache(auth, state), { groups: ['cache'] });
            await localforage.setItem(LOCAL_STORAGE_KEY, c);
        }
    };

    return (
        <TabLoadingContext.Provider value={{ load, loading }}>
            <TabContext.Provider value={context} {...props} />
        </TabLoadingContext.Provider>
    );
};

export default TabProvider;
