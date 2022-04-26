import { SplitWrapper } from 'equisoft-design-ui-elements';
import React, { useContext } from 'react';
import styled from 'styled-components';
import EditorMainArea from '../../components/editor/editorArea';
import useGlobalKeydown from '../../components/general/hooks/globalKeyDown';
import RightbarContent from '../../components/general/sidebar/content/rightbarContent';
import SidebarContent from '../../components/general/sidebar/content/sidebarContent';
import { RightbarContext } from '../../components/general/sidebar/rightbarContext';
import { SidebarContext, SIDEBAR_MIN_SIZE } from '../../components/general/sidebar/sidebarContext';
import { Panel } from '../../components/general/sidebar/style';
import NavBar from './navBar';

const EditorArea = styled.div`
    height: 100%;
    width: calc(100vw - 56px);
`;

const AppContent = () => {
    const { sidebarSize, setSidebarSize, openSidebar, closeSidebar } = useContext(SidebarContext);
    const { rightbarSize, openRightbar, closeRightbar, setRightbarSize } = useContext(RightbarContext);

    const snap = SIDEBAR_MIN_SIZE; // %
    const sidebarDragged = (s: number[]) => {
        if (sidebarSize === 0) openSidebar();
        if (s[0] < snap) closeSidebar();

        if (rightbarSize === 0) openRightbar();
        if (s[2] < snap) closeRightbar();

        setSidebarSize(s[0]);
        setRightbarSize(s[2]);
    };

    const toggleSidebar = () => {
        if (sidebarSize) {
            closeSidebar();
        } else {
            openSidebar();
        }
    };

    useGlobalKeydown({ keys: ['ctrl', 'b'], onKeyDown: toggleSidebar }, [sidebarSize, toggleSidebar]);

    return (
        <>
            <NavBar />
            <EditorArea>
                <SplitWrapper
                    cursor={'col-resize'}
                    forceSizes={[sidebarSize, 100 - sidebarSize - rightbarSize, rightbarSize]}
                    snapPercent={snap}
                    onDragEnd={sidebarDragged}
                >
                    <Panel hidden={!sidebarSize}>
                        <SidebarContent />
                    </Panel>
                    <EditorMainArea />
                    <Panel hidden={!rightbarSize}>
                        <RightbarContent />
                    </Panel>
                </SplitWrapper>
            </EditorArea>
        </>
    );
};

export default AppContent;
