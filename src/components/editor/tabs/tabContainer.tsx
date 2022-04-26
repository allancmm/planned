import { ListWithDropdownOverflow, Loading } from 'equisoft-design-ui-elements';
import React, { MouseEvent, useContext } from 'react';
import { DragObjectWithType, useDrop } from 'react-dnd';
import { Layout } from 'react-feather';
import { EditorMain } from '../editorArea/style';
import TabContent from './content/tabContent';
import { TabContext, TabLoadingContext, useLayoutWithId, useTabActions } from './tabContext';
import { SplitButton, Tabs } from './tabList/style';
import Tab from './tabList/tab';
import { ACTIVATE, CLOSE, FOCUS, MOVE_TAB, SPLIT } from './tabReducerTypes';

interface TabsContainerProps {
    layoutId: number;
}

const TabsContainer = ({ layoutId }: TabsContainerProps) => {
    const {
        state: { focusLayout },
    } = useContext(TabContext);
    const dispatch = useTabActions();
    const myLayout = useLayoutWithId(layoutId);
    const myTabs = myLayout.tabIds;
    const { loading } = useContext(TabLoadingContext);

    const splitLayout = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        dispatch({ type: SPLIT, payload: { layoutId } });
    };

    const doFocusLayout = () => {
        if (focusLayout !== layoutId) {
            dispatch({ type: FOCUS, payload: { layoutId } });
        }
    };

    const changeTabPosition = (tabId: string, position: number) => {
        dispatch({
            type: MOVE_TAB,
            payload: { tabId, origin: layoutId, destination: layoutId, position },
        });
    };

    const [{ highlighted }, drop] = useDrop({
        accept: 'Tab',
        drop: (item: DragObjectWithType & { tabId: string; layoutId: number }) => {
            if (item.layoutId !== layoutId) {
                dispatch({
                    type: MOVE_TAB,
                    payload: { tabId: item.tabId, origin: item.layoutId, destination: layoutId },
                });
            }
            item.layoutId = layoutId;
        },
        collect: (monitor) => ({ highlighted: monitor.canDrop() }),
    });

    return (
        <EditorMain ref={drop} highlighted={highlighted} onClick={doFocusLayout}>
            <Tabs>
                <ListWithDropdownOverflow changeItemPosition={changeTabPosition} active={myLayout.active}>
                    {myTabs.map((tabId: string, i: number) => (
                        <Tab
                            key={tabId}
                            tabId={tabId}
                            layoutId={layoutId}
                            index={i}
                            active={myLayout.active === tabId}
                            focus={focusLayout === layoutId}
                            handleCloseTab={() => dispatch({ type: CLOSE, payload: { id: tabId, layoutId } })}
                            setActiveTab={() => dispatch({ type: ACTIVATE, payload: { id: tabId, layoutId } })}
                            onTabDrag={changeTabPosition}
                        />
                    ))}
                </ListWithDropdownOverflow>
                {focusLayout === layoutId && (
                    <SplitButton onClick={splitLayout}>
                        <Layout />
                    </SplitButton>
                )}
            </Tabs>
            <Loading loading={loading} />
            {myTabs
                .filter((tabId) => tabId === myLayout.active)
                .map((tabId: string) => (
                    <TabContent key={tabId} tabId={tabId} layoutId={layoutId} />
                ))}
        </EditorMain>
    );
};

export default TabsContainer;
