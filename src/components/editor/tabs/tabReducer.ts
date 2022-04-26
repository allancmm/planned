import produce, {Draft, setAutoFreeze} from 'immer';
import {toast} from 'react-toastify';
import EntityLockStatus from '../../../lib/domain/entities/entityLockStatus';
import EntityStatus from '../../../lib/domain/entities/entityStatus';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import InterpreterSession from '../../../lib/domain/entities/tabData/interpreterSession';
import {ITabData} from '../../../lib/domain/entities/tabData/iTabData';
import {
    ACTIVATE,
    CLOSE,
    EDIT_DATA_FIELDS,
    EDIT_TAB_DATA,
    EDIT_USER_DATA,
    FOCUS,
    LayoutItem,
    LayoutStore,
    LOAD_STORE,
    MONACO_DISPOSE,
    MOVE_TAB,
    OPEN,
    SAVE_DIFF_TAB_STATE,
    SAVE_TAB_STATE,
    SET_DIFF_LAYOUT_EDITOR,
    SET_LAYOUT_EDITOR,
    SPLIT,
    STATUS_CHANGED,
    Store,
    TabActions,
    TabItem,
    TabStore,
} from './tabReducerTypes';
import {determineTabTypeFromData} from './tabTypes';

setAutoFreeze(false);

const handleSplitTab = (draft: Draft<Store>, { layoutId }: { layoutId: number }) => {
    const tabToDuplicate = draft.layouts[layoutId].active;

    draft.layouts = Object.entries(draft.layouts).reduce((curr: LayoutStore, [key, value]) => {
        const id = parseInt(key, 10);
        const newId = id > layoutId ? id + 1 : id;
        value.layoutId = newId;
        curr[newId] = value;
        return curr;
    }, {});

    draft.focusLayout = layoutId + 1;
    draft.layouts[draft.focusLayout] = new LayoutItem(
        draft.focusLayout,
        tabToDuplicate,
        [tabToDuplicate],
        {
            [tabToDuplicate]: draft.tabs[tabToDuplicate].model.map(
                (m, i) =>
                    draft.layouts[layoutId].editorInstance.find((e) => e.getModel()?.id === m?.id)?.saveViewState() ??
                    draft.layouts[layoutId].viewState[tabToDuplicate][i],
            ),
        },
        { [tabToDuplicate]: draft.layouts[layoutId].editorDiffInstance?.saveViewState() ?? null },
    );

    // copy view state of interpreter in opened in same tab
    if (draft.tabs[tabToDuplicate]?.data instanceof EntityInformation) {
        const tabData = draft.tabs[tabToDuplicate].data as EntityInformation;
        const interTabId = tabData.generateInterpreterTabId();
        if (draft.tabs[interTabId]) {
            const interData = draft.tabs[interTabId].data as InterpreterSession;
            if (!interData.standalone) {
                draft.layouts[draft.focusLayout].viewState[interTabId] = draft.tabs[interTabId].model.map(
                    (m, i) =>
                        draft.layouts[layoutId].editorInstance
                            .find((e) => e.getModel()?.id === m?.id)
                            ?.saveViewState() ?? draft.layouts[layoutId].viewState[interTabId][i],
                );
            }
        }
    }
};

const openNewTab = (
    draft: Draft<Store>,
    { data, reloadContent, hidden }: { data: ITabData; reloadContent?: boolean; hidden?: boolean },
) => {
    const id = data.generateTabId();
    const focus = draft.focusLayout || 0;
    let focusedLayout = draft.layouts[focus];
    if (!focusedLayout) {
        focusedLayout = new LayoutItem(focus);
        draft.layouts[focus] = focusedLayout;
    }
    const existsInLayout = focusedLayout.tabIds.find((t) => t === id);
    const addToLayout = () => {
        if (!hidden) {
            focusedLayout.active = id;
            focusedLayout.tabIds.unshift(id);
            draft.layouts[focus] = focusedLayout;
        }
        draft.layouts[focus].viewState[id] = [];
        draft.layouts[focus].viewDiffState[id] = null;
    };

    if (!reloadContent) {
        if (existsInLayout) {
            // tab is opened in focused layout, activate it
            if (focusedLayout.active === id) {
                toast.info('Tab is already opened, and focused...', { theme: 'light' });
            }
            draft.layouts[focus].active = id;
            return;
        }
        addToLayout();
    } else {
        if (!existsInLayout) {
            addToLayout();
        }
        if (!hidden) focusedLayout.active = id;

        draft.tabs = Object.values(draft.tabs).reduce((curr: TabStore, tab) => {
            if (tab.data.getGuid() === data.getGuid()) {
                tab.data.status = data.status;
                tab.data.lockStatus = data.lockStatus;
                Object.values(draft.layouts)
                    .filter((l) => l.active === tab.id)
                    // dispose "main" monaco to force a full refresh
                    .forEach((l) => l.editorInstance[0]?.setModel(null));
            }
            curr[tab.id] = tab;
            return curr;
        }, {});
    }

    draft.tabs[id] = new TabItem(id, data.getName(), determineTabTypeFromData(data), data);
};

const closeTab = (draft: Draft<Store>, { id, layoutId }: { id: string; layoutId: number }) => {
    const layoutTabsWithId = Object.values(draft.layouts)
        .flatMap((l: LayoutItem) => l.tabIds)
        .filter((tid) => tid === id);

    // dispose of editor model if it's the last opened tab
    let interId = '';
    const data = draft.tabs[id].data;
    if (data instanceof EntityInformation) {
        interId = data.generateInterpreterTabId();
    }
    if (layoutTabsWithId.length <= 1) {
        if (interId) {
            const interData = draft.tabs[interId]?.data;
            if (interData instanceof InterpreterSession && !interData.standalone) {
                delete draft.tabs[interId];
            }
        }

        draft.tabs[id]?.model?.forEach((m) => m?.dispose());
        draft.tabs = Object.entries(draft.tabs).reduce((curr: TabStore, [key, value]) => {
            if (key !== id) curr[key] = value;
            return curr;
        }, {});
    }

    // remove id from layout
    draft.layouts[layoutId].tabIds = draft.layouts[layoutId].tabIds.filter((t) => t !== id);
    delete draft.layouts[layoutId].viewDiffState[id];
    delete draft.layouts[layoutId].viewState[id];
    if (interId) {
        delete draft.layouts[layoutId].viewState[interId];
    }

    // if there is no tab remaining in the layout, shift back the others and don't add it back
    if (draft.layouts[layoutId].tabIds.length === 0) {
        closeLayout(draft, layoutId);
    } else {
        if (draft.layouts[layoutId].active === id) {
            draft.layouts[layoutId].active = draft.layouts[layoutId].tabIds[0];
        }
    }
};

const closeLayout = (draft: Draft<Store>, layoutId: number) => {
    draft.layouts[layoutId]?.editorInstance?.forEach((e) => e?.dispose());
    draft.layouts[layoutId]?.editorDiffInstance?.dispose();

    draft.layouts = Object.entries(draft.layouts).reduce((curr: LayoutStore, [key, value]) => {
        const lid = parseInt(key, 10);
        if (lid === layoutId) {
            draft.focusLayout = 0;
            return curr;
        }

        const newId = lid > layoutId ? lid - 1 : lid;
        // shift focused layout too
        if (lid === draft.focusLayout) {
            draft.focusLayout = newId;
        }
        value.layoutId = newId;
        curr[newId] = value;
        return curr;
    }, {});
};

const moveTab = (
    draft: Draft<Store>,
    { tabId, origin, destination, position }: { tabId: string; origin: number; destination: number; position?: number },
) => {
    draft.layouts[origin].tabIds = draft.layouts[origin].tabIds.filter((t) => t !== tabId);
    if (draft.layouts[origin].active === tabId && origin !== destination) {
        // if changed layouts, check out for active
        draft.layouts[origin].active = draft.layouts[origin].tabIds[0];
    }

    if (origin === destination || !draft.layouts[destination].tabIds.includes(tabId)) {
        // if changed layouts, prevent duplicates
        draft.layouts[destination].tabIds.splice(position ?? 0, 0, tabId);
    }

    draft.layouts[destination].viewState[tabId] = draft.layouts[origin].viewState[tabId];
    draft.layouts[destination].viewDiffState[tabId] = draft.layouts[origin].viewDiffState[tabId];

    draft.layouts[destination].active = tabId;
    draft.focusLayout = destination;

    if (draft.layouts[origin].tabIds.length === 0) closeLayout(draft, origin); // do this last, because of layout shifting
};

export default produce((draft: Store, action: TabActions) : Store => {
    switch (action.type) {
        case LOAD_STORE: {
            return action.payload.store as Store;
        }
        case SAVE_TAB_STATE: {
            const { id, layoutId, model, viewState, modelInstance, layoutInstance } = action.payload;

            if (model) {
                draft.tabs[id].model[modelInstance] = model;
            }

            if (draft.layouts[layoutId]?.viewState[id]) {
                draft.layouts[layoutId].viewState[id][modelInstance] =
                    viewState || draft.layouts[layoutId].editorInstance[layoutInstance]?.saveViewState();
            }

            break;
        }
        case SET_LAYOUT_EDITOR: {
            const { layoutId, editorInstance, instance } = action.payload;
            draft.layouts[layoutId].editorInstance[instance] = editorInstance;
            break;
        }
        case SAVE_DIFF_TAB_STATE: {
            const { id, layoutId, model, viewDiffState } = action.payload;

            if (model) {
                draft.tabs[id].model = model;
            }

            if (draft.layouts[layoutId]?.viewDiffState[id]) {
                draft.layouts[layoutId].viewDiffState[id] =
                    viewDiffState || draft.layouts[layoutId].editorDiffInstance?.saveViewState() || null;
            }

            break;
        }
        case SET_DIFF_LAYOUT_EDITOR: {
            const { layoutId, editorDiffInstance } = action.payload;
            draft.layouts[layoutId].editorDiffInstance = editorDiffInstance;
            break;
        }
        case EDIT_DATA_FIELDS: {
            const { id, name, value } = action.payload;
            const index = (draft.tabs[id].data as EntityInformation).dataFields.findIndex((f) => f.name === name);
            (draft.tabs[id].data as EntityInformation).dataFields[index].value = value;
            break;
        }
        case EDIT_USER_DATA: {
            const { tabId, name, value } = action.payload;
            draft.tabs[tabId].userData[name] = value;
            break
        }
        case SPLIT: {
            handleSplitTab(draft, action.payload);
            break;
        }
        case ACTIVATE: {
            const { layoutId, id } = action.payload;
            draft.layouts[layoutId].active = id;
            draft.focusLayout = layoutId;
            break;
        }
        case FOCUS: {
            draft.focusLayout = action.payload.layoutId;
            break;
        }
        case OPEN: {
            openNewTab(draft, action.payload);
            break;
        }
        case CLOSE: {
            closeTab(draft, action.payload);
            break;
        }
        case STATUS_CHANGED: {
            const { guid, status, lock } = action.payload;
            draft.tabs = Object.values(draft.tabs).reduce((curr: TabStore, tab) => {
                if (tab.data.getGuid() === guid) {
                    if (!lock) {
                        tab.data.status = status as EntityStatus;
                    } else {
                        tab.data.lockStatus = status as EntityLockStatus;
                    }
                    Object.values(draft.layouts).forEach(
                        (l: LayoutItem) => (l.viewState[tab.id] = l.editorInstance.map((e) => e.saveViewState())),
                    );
                }
                curr[tab.id] = tab;
                return curr;
            }, {});

            break;
        }
        case MOVE_TAB: {
            moveTab(draft, action.payload);
            break;
        }
        case EDIT_TAB_DATA: {
            const { tabId, data } = action.payload;
            if (draft.tabs[tabId]) {
                // race condition can happen when spam closing tabs, and we try to save something that got closed
                draft.tabs[tabId].data = data;
            }
            break;
        }
        case MONACO_DISPOSE: {
            const { layoutId, tabId, instances, dispose } = action.payload;

            if (draft.layouts[layoutId]) {
                draft.layouts[layoutId].editorInstance?.forEach((e, i) => {
                    if (!instances || instances.includes(i)) {
                        e.setModel(null);
                    }
                });
                draft.layouts[layoutId].editorDiffInstance?.setModel(null);

                if (dispose) {
                    if (dispose === 'all') {
                        draft.tabs[tabId ?? draft.layouts[layoutId].active].model.forEach((m) => m?.dispose());
                    } else {
                        dispose?.forEach((d) =>
                            draft.tabs[tabId ?? draft.layouts[layoutId].active].model[d]?.dispose(),
                        );
                    }
                }
            }
            break;
        }
    }
    return draft;
});
