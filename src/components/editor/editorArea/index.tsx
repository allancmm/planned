import { SplitWrapper } from 'equisoft-design-ui-elements';
import React, { useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ErrorBoundary from '../../general/error/errorBoundary';
import TabsContainer from '../tabs/tabContainer';
import { TabContext } from '../tabs/tabContext';
import { BackgroundImage, BackgroundWrapper, EditorWrapper, Label, LabelWrapper, WrapperContainer } from './style';

const EditorMainArea = () => {
    const {
        state: { layouts },
    } = useContext(TabContext);

    return (
        <WrapperContainer>
            <BackgroundWrapper>
                <BackgroundImage src={'equisoft_logo.png'} alt="EquisoftLogo" />
                <LabelWrapper>
                    <Label>(ALT+H) to view your recent activities</Label>
                    <Label>(ALT+E) to open the explorer tree</Label>
                    <Label>(ALT+F) to open the search panel</Label>
                </LabelWrapper>
            </BackgroundWrapper>
            <EditorWrapper>
                <ErrorBoundary>
                    <DndProvider backend={HTML5Backend}>
                        <SplitWrapper cursor={'col-resize'} minSize={325}>
                            {Object.keys(layouts)
                                .map((l) => parseInt(l, 10))
                                .sort()
                                .map((layoutId: number) => (
                                    <TabsContainer key={layoutId} layoutId={layoutId} />
                                ))}
                        </SplitWrapper>
                    </DndProvider>
                </ErrorBoundary>
            </EditorWrapper>
        </WrapperContainer>
    );
};

export default EditorMainArea;
