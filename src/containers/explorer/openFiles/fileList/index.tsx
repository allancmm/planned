import React from 'react';
import { useTabActions, useTabWithId } from '../../../../components/editor/tabs/tabContext';
import { ACTIVATE, CLOSE, TabItem } from '../../../../components/editor/tabs/tabReducerTypes';
import GroupedEntitySummaryList from '../../../../components/general/sidebar/entitySummary/groupedEntitySummaryList';
import EntityInformation from '../../../../lib/domain/entities/tabData/entityInformation';
import { CloseIcon } from "../../../../components/general";
import {FileListContainer} from "./styles";

interface FileListProps {
    tabIds: string[];
    layoutId: number;
}

const FileList = ({ tabIds, layoutId }: FileListProps) => {
    const dispatch = useTabActions();

    const activateTab = (tab: TabItem) => {
        dispatch({ type: ACTIVATE, payload: { id: tab.id, layoutId } });
    };

    return (
        <FileListContainer>
            <GroupedEntitySummaryList
                rows={tabIds.map(useTabWithId)}
                rowMapper={(tab: TabItem) => ({
                    id: tab.id,
                    entityType: tab.data.getType(),
                    name: tab.name,
                    fileType: tab.data instanceof EntityInformation ? tab.data.fileType : undefined,
                    tabType: tab.tabType,
                    extraInformation: tab.data.getExtra(),
                    onClick: () => activateTab(tab),
                    actions: (
                        <CloseIcon onClick={() => dispatch({ type: CLOSE, payload: { id: tab.id, layoutId } })} />
                    ),
                })}
                select={activateTab}
            />
        </FileListContainer>
    );
};

export default FileList;
