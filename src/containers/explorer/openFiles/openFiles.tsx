import { CollapseContainer } from 'equisoft-design-ui-elements';
import React, { useContext } from 'react';
import { TabContext, useTabActions } from '../../../components/editor/tabs/tabContext';
import { CLOSE, LayoutItem } from '../../../components/editor/tabs/tabReducerTypes';
import FileList from './fileList';
import { CloseIcon } from "../../../components/general";
import { NoOpenedFilesContainer } from "./styles";

export const OpenFiles = ({ openedTree, setOpenedTree }: { openedTree: string; setOpenedTree(s: string): void }) => {
    const {
        state: { layouts },
    } = useContext(TabContext);
    const dispatch = useTabActions();

    const allLayouts: LayoutItem[] = Object.values(layouts);

    const closeLayout = (layout: LayoutItem) => {
        const { layoutId, tabIds } = layout;
        tabIds.forEach((id) => dispatch({ type: CLOSE, payload: { id, layoutId } }));
    };

    const treeId = 'Open View';
    return (
        <CollapseContainer title={treeId} open={openedTree === treeId} toggleOpen={() => setOpenedTree(treeId)}>
            {(() => {
                switch (allLayouts.length) {
                    case 0:
                        return <NoOpenedFilesContainer>No opened files</NoOpenedFilesContainer>;
                    default:
                        return (
                            <>
                                {allLayouts.map((layout) => (
                                    <CollapseContainer
                                        key={layout.layoutId}
                                        title={`Group ${layout.layoutId + 1}`}
                                        defaultOpened
                                        level={1}
                                        actions={<CloseIcon onClick={() => closeLayout(layout)} />}
                                    >
                                        <FileList layoutId={layout.layoutId} tabIds={layout.tabIds} />
                                    </CollapseContainer>
                                ))}
                            </>
                        );
                }
            })()}
        </CollapseContainer>
    );
};

export default OpenFiles;
