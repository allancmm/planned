import { Exclude, Transform, Type } from 'class-transformer';
import { immerable, Immutable } from 'immer';
import { editor } from 'monaco-editor';
import AuthData from '../../../lib/domain/entities/authData';
import EntityLockStatus from '../../../lib/domain/entities/entityLockStatus';
import EntityStatus from '../../../lib/domain/entities/entityStatus';
import { ITabData } from '../../../lib/domain/entities/tabData/iTabData';
import { subTypes } from '../../../lib/domain/entities/tabData/iTabDataUtils';
import { convertDictionary } from '../../../lib/util/transform';
import { TabType } from './tabTypes';

export interface TabStore {
    [tabId: string]: TabItem;
}

interface UserData {
    [nameField: string]: any;
}

export interface LayoutStore {
    [layoutId: number]: LayoutItem;
}

export class TabItem {
    [immerable] = true;

    public id: string;

    public name: string;
    public tabType: TabType;

    @Type(() => ITabData, {
        discriminator: {
            property: 'clazz',
            subTypes: subTypes,
        },
    })
    public data: ITabData;

    public userData : UserData = {};

    @Exclude()
    public model: (editor.ITextModel | null)[];

    constructor(id: string, name: string, tabType: TabType, data: ITabData, model: (editor.ITextModel | null)[] = []) {
        this.id = id;
        this.name = name;
        this.tabType = tabType;
        this.data = data;

        this.model = model;
    }
}

export class LayoutItem {
    [immerable] = true;

    public layoutId: number;
    public active: string;
    public tabIds: string[];

    @Transform((v) =>
        Object.entries(v).reduce((acc: any, [id, _]: any) => {
            acc[id] = [];
            return acc;
        }, {}),
    )
    public viewState: { [id: string]: (editor.ICodeEditorViewState | null)[] };

    @Transform((v) =>
        Object.entries(v).reduce((acc: any, [id, _]: any) => {
            acc[id] = null;
            return acc;
        }, {}),
    )
    public viewDiffState: { [id: string]: editor.IDiffEditorViewState | null };

    @Exclude()
    public editorInstance: editor.IStandaloneCodeEditor[];

    @Exclude()
    public editorDiffInstance?: editor.IStandaloneDiffEditor | null;

    constructor(
        layoutId: number,
        active: string = '',
        tabIds: string[] = [],
        viewState: { [id: string]: (editor.ICodeEditorViewState | null)[] } = {},
        viewDiffState: { [id: string]: editor.IDiffEditorViewState | null } = {},
        editorInstance: editor.IStandaloneCodeEditor[] = [],
        editorDiffInstance: editor.IStandaloneDiffEditor | null = null,
    ) {
        this.layoutId = layoutId;
        this.active = active;
        this.tabIds = tabIds;
        this.viewState = viewState;
        this.viewDiffState = viewDiffState;
        this.editorInstance = editorInstance;
        this.editorDiffInstance = editorDiffInstance;
    }
}

export class Cache {
    [immerable] = true;

    @Type(() => AuthData)
    public auth: AuthData;
    @Type(() => Store)
    public store: Immutable<Store>;

    constructor(auth: AuthData, store: Immutable<Store>) {
        this.auth = auth;
        this.store = store;
    }

    matchesAuthContext(auth: AuthData): boolean {
        return this.auth.sameAs(auth);
    }
}
export class Store {
    [immerable] = true;

    @Transform(convertDictionary(TabItem, { groups: ['cache'] }))
    public tabs: TabStore = {};

    @Transform(convertDictionary(LayoutItem, { groups: ['cache'] }))
    public layouts: LayoutStore = {};
    public focusLayout: number = 0;

    constructor(tabs: TabStore = {}, layouts: LayoutStore = {}) {
        this.tabs = tabs;
        this.layouts = layouts;
    }
}

export const SAVE_TAB_STATE = 'saveTabState';
interface SaveTabStateAction {
    type: typeof SAVE_TAB_STATE;
    payload: {
        id: string;
        layoutId: number;
        model?: editor.ITextModel | null;
        viewState?: editor.ICodeEditorViewState | null;
        modelInstance: number;
        layoutInstance: number;
    };
}

export const SAVE_DIFF_TAB_STATE = 'saveDiffTabState';
interface SaveDiffTabStateAction {
    type: typeof SAVE_DIFF_TAB_STATE;
    payload: {
        id: string;
        layoutId: number;
        model?: (editor.ITextModel | null)[];
        viewDiffState?: editor.IDiffEditorViewState | null;
    };
}

export const SET_LAYOUT_EDITOR = 'layoutEditor';
interface SetLayoutEditorAction {
    type: typeof SET_LAYOUT_EDITOR;
    payload: { layoutId: number; editorInstance: editor.IStandaloneCodeEditor; instance: number };
}

export const SET_DIFF_LAYOUT_EDITOR = 'diffLayoutEditor';
interface SetDiffLayoutEditorAction {
    type: typeof SET_DIFF_LAYOUT_EDITOR;
    payload: { layoutId: number; editorDiffInstance: editor.IStandaloneDiffEditor };
}

export const EDIT_DATA_FIELDS = 'editDataFields';
interface EditDataFieldsAction {
    type: typeof EDIT_DATA_FIELDS;
    payload: { id: string; name: string; value: string };
}

export const SPLIT = 'split';
interface SplitAction {
    type: typeof SPLIT;
    payload: { layoutId: number };
}

export const ACTIVATE = 'activate';
interface ActivateAction {
    type: typeof ACTIVATE;
    payload: { id: string; layoutId: number };
}

export const FOCUS = 'focus';
interface FocusAction {
    type: typeof FOCUS;
    payload: { layoutId: number };
}

export const OPEN = 'open';
interface OpenAction {
    type: typeof OPEN;
    payload: { data: ITabData; reloadContent?: boolean; hidden?: boolean };
}

export const CLOSE = 'close';
interface CloseAction {
    type: typeof CLOSE;
    payload: { id: string; layoutId: number };
}

export const STATUS_CHANGED = 'statusChanged';
interface StatusChangedAction {
    type: typeof STATUS_CHANGED;
    payload: { guid: string; status: EntityStatus | EntityLockStatus; lock?: boolean };
}

export const MOVE_TAB = 'moveTab';
interface MoveTabAction {
    type: typeof MOVE_TAB;
    payload: { tabId: string; origin: number; destination: number; position?: number };
}

export const EDIT_TAB_DATA = 'edit_Tab_Data';
interface EditTabDataAction {
    type: typeof EDIT_TAB_DATA;
    payload: { tabId: string; data: ITabData };
}

export const EDIT_USER_DATA = 'edit_User_Data';
interface EditTabUserData {
    type: typeof EDIT_USER_DATA;
    payload: { tabId: string; name: string, value: any };
}

export const MONACO_DISPOSE = 'monaco_dispose';
interface MonacoDisposeAction {
    type: typeof MONACO_DISPOSE;
    payload: { layoutId: number; tabId?: string; dispose?: number[] | 'all'; instances?: number[] };
}

export const LOAD_STORE = 'load_store';
interface LoadStoreAction {
    type: typeof LOAD_STORE;
    payload: { store: Immutable<Store> };
}

export type TabActions =
    | SaveTabStateAction
    | SetLayoutEditorAction
    | SaveDiffTabStateAction
    | SetDiffLayoutEditorAction
    | SplitAction
    | ActivateAction
    | FocusAction
    | OpenAction
    | CloseAction
    | StatusChangedAction
    | EditDataFieldsAction
    | MoveTabAction
    | EditTabDataAction
    | MonacoDisposeAction
    | LoadStoreAction
    | EditTabUserData;
