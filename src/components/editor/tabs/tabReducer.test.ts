import { editor } from 'monaco-editor';
import { mock } from 'ts-mockito';
import EntityStatus from '../../../lib/domain/entities/entityStatus';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import reducer from './tabReducer';
import {
    ACTIVATE,
    CLOSE,
    EDIT_DATA_FIELDS,
    FOCUS,
    LayoutItem,
    MOVE_TAB,
    OPEN,
    SPLIT,
    STATUS_CHANGED,
    Store,
    TabItem,
} from './tabReducerTypes';

const init = (): Store => new Store();

describe('Tab Context Reducer', () => {
    let emptyStore = init();
    let data: EntityInformation;
    beforeEach(() => {
        emptyStore = init();
        data = new EntityInformation();
        data.oipaRule.ruleGuid = 'test2';
        data.oipaRule.ruleName = 'test2';
    });

    test('should focus layout properly', () => {
        const newState = reducer(emptyStore, { type: FOCUS, payload: { layoutId: 1 } });
        expect(newState.focusLayout).toBe(1);

        expect(newState).not.toEqual(emptyStore);
    });

    describe('Activating a tab', () => {
        test('should put a tab as active for the layout', () => {
            emptyStore.layouts[0] = new LayoutItem(0, 'test1', ['test1', 'test2'], { test1: [], test2: [] });
            const tab1 = 'test1';
            emptyStore.tabs[tab1] = new TabItem('test1', '', 'UserStatistics', data, []);
            const tab2 = 'test2';
            emptyStore.tabs[tab2] = new TabItem('test2', '', 'UserStatistics', data, []);

            const newState = reducer(emptyStore, { type: ACTIVATE, payload: { id: 'test2', layoutId: 0 } });
            expect(newState.layouts[0].active).toEqual('test2');
        });
    });

    describe('Moving a tab', () => {
        test('should move tab index in same layout', () => {
            emptyStore.layouts[0] = new LayoutItem(0, 'test1', ['test1', 'test2', 'test3'], {
                test1: [],
                test2: [],
                test3: [],
            });

            const newState = reducer(emptyStore, {
                type: MOVE_TAB,
                payload: { tabId: 'test1', origin: 0, destination: 0, position: 1 },
            });
            expect(newState.layouts[0].tabIds).toEqual(['test2', 'test1', 'test3']);
        });

        test('should move tab across layouts', () => {
            emptyStore.layouts[0] = new LayoutItem(0, 'test1', ['test1', 'test2'], { test1: [], test2: [] });
            emptyStore.layouts[1] = new LayoutItem(1, 'test3', ['test3'], { test3: [] });

            const newState = reducer(emptyStore, {
                type: MOVE_TAB,
                payload: { tabId: 'test1', origin: 0, destination: 1, position: 0 },
            });
            expect(newState.layouts[0].tabIds).toEqual(['test2']);
            expect(newState.layouts[1].tabIds).toEqual(['test1', 'test3']);
        });
    });

    describe('Opening a tab', () => {
        test('should add a tab to the focused layout', () => {
            emptyStore.layouts[0] = new LayoutItem(0, 'test1', ['test1'], { test1: [] });

            const newState = reducer(emptyStore, {
                type: OPEN,
                payload: { data },
            });
            expect(newState.layouts[0].tabIds).toEqual(['test2 - DEFAULT', 'test1']);
            expect(newState.layouts[0].active).toBe('test2 - DEFAULT');
        });

        test('should create layout if it doesnt exist', () => {
            const newState = reducer(emptyStore, {
                type: OPEN,
                payload: { data },
            });

            expect(newState.layouts).toHaveProperty('0');
            expect(newState.layouts[0].tabIds).toEqual(['test2 - DEFAULT']);
        });

        test('should add tab to tab store', () => {
            const newState = reducer(emptyStore, {
                type: OPEN,
                payload: { data },
            });

            expect(newState.tabs).toHaveProperty('test2 - DEFAULT');
            expect(newState.tabs['test2 - DEFAULT']).toEqual(new TabItem('test2 - DEFAULT', 'test2', 'Unknown', data));
        });
    });

    describe('Changing tab status', () => {
        const guid = 'test2';
        beforeEach(() => {
            emptyStore.tabs[guid] = new TabItem(guid, guid, 'Editor', data);
        });

        test('should update the tab store with new status', () => {
            const status: EntityStatus = {
                status: 'checkOut',
                user: 'test',
                readOnly: true,
                versionNumber: 9999,
                lastModifiedBy: 'test2',
                lastModifiedGMT: '',
                versionGuid: '',
            };

            const newState = reducer(emptyStore, {
                type: STATUS_CHANGED,
                payload: { guid, status },
            });

            const newData = newState.tabs[guid].data;
            if (newData instanceof EntityInformation) {
                expect(newData.status).toEqual(status);
            } else {
                fail('data does not have a status');
            }
        });
    });

    describe('Edit tab data', () => {
        const guid = 'test2';
        beforeEach(() => {
            emptyStore.tabs[guid] = new TabItem(guid, guid, 'Editor', data);
            (emptyStore.tabs[guid].data as EntityInformation).dataFields = [
                { name: 'test', value: 'badValue', type: '', disabled: false },
                { name: 'test2', value: 'value', type: '', disabled: false },
            ];
        });

        test('should modify the correct field data', () => {
            const newState = reducer(emptyStore, {
                type: EDIT_DATA_FIELDS,
                payload: { id: 'test2', name: 'test', value: 'testValue' },
            });

            expect((newState.tabs[guid].data as EntityInformation).dataFields).toEqual([
                { name: 'test', value: 'testValue', type: '', disabled: false },
                { name: 'test2', value: 'value', type: '', disabled: false },
            ]);
        });
    });

    describe('Split Layouts', () => {
        beforeEach(() => {
            emptyStore.layouts[0] = new LayoutItem(
                0,
                'test1',
                ['test1'],
                { test1: [] },
                {},
                [mock<editor.IStandaloneCodeEditor>()],
                null,
            );
            emptyStore.layouts[1] = new LayoutItem(
                1,
                'test2',
                ['test2'],
                { test2: [] },
                {},
                [mock<editor.IStandaloneCodeEditor>()],
                null,
            );

            const tab1 = 'test1';
            emptyStore.tabs[tab1] = new TabItem('test1', '', 'UserStatistics', data, []);
            const tab2 = 'test2';
            emptyStore.tabs[tab2] = new TabItem('test2', '', 'UserStatistics', data, []);
        });

        test('should create a new layout', () => {
            const newState = reducer(emptyStore, {
                type: SPLIT,
                payload: { layoutId: 1 },
            });

            expect(newState.layouts).toHaveProperty('2');
            expect(newState.layouts[2].tabIds).toEqual(['test2']);
            expect(newState.layouts[2].active).toBe('test2');

            expect(newState.focusLayout).toBe(2);
        });

        test('should increment other layouts', () => {
            const newState = reducer(emptyStore, {
                type: SPLIT,
                payload: { layoutId: 0 },
            });

            expect(newState.layouts).toHaveProperty('2');

            expect(newState.layouts[1].tabIds).toEqual(['test1']);
            expect(newState.layouts[1].active).toBe('test1');

            expect(newState.layouts[2].tabIds).toEqual(['test2']);
            expect(newState.layouts[2].active).toBe('test2');

            expect(newState.focusLayout).toBe(1);
        });
    });

    describe('Closing tab', () => {
        beforeEach(() => {
            emptyStore.layouts[0] = new LayoutItem(0, 'test1', ['test1'], { test1: [] });
            emptyStore.layouts[1] = new LayoutItem(1, 'test2', ['test2', 'test1'], { test2: [], test1: [] });

            const tab1 = 'test1';
            emptyStore.tabs[tab1] = new TabItem('test1', '', 'UserStatistics', data, []);
            const tab2 = 'test2';
            emptyStore.tabs[tab2] = new TabItem('test2', '', 'UserStatistics', data, []);
        });

        test('should remove tab from layout', () => {
            const newState = reducer(emptyStore, {
                type: CLOSE,
                payload: { id: 'test1', layoutId: 1 },
            });

            expect(newState.layouts[1].tabIds).not.toContain('test1');
        });

        test('should change active tab if its closing', () => {
            const newState = reducer(emptyStore, {
                type: CLOSE,
                payload: { id: 'test2', layoutId: 1 },
            });

            expect(newState.layouts[1].active).toBe('test1');
        });

        test('should close layout if there is no tab remaining', () => {
            emptyStore.focusLayout = 1;
            const newState = reducer(emptyStore, {
                type: CLOSE,
                payload: { id: 'test1', layoutId: 0 },
            });

            expect(newState.layouts[0].tabIds).toEqual(['test2', 'test1']); // layout 1 got shifted back to 0
            expect(newState.focusLayout).toBe(0);
        });

        test('should remove from tabStore if its the last opened instance', () => {
            const newState = reducer(emptyStore, {
                type: CLOSE,
                payload: { id: 'test2', layoutId: 1 },
            });

            expect(newState.tabs).not.toHaveProperty('test2');
        });
    });
});
