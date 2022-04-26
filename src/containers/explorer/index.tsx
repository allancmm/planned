import React, { useContext, useState } from 'react';
import { TreeItem } from 'react-sortable-tree';
import { TabLoadingContext, useTabActions } from '../../components/editor/tabs/tabContext';
import { OPEN } from '../../components/editor/tabs/tabReducerTypes';
import { SidebarContext } from '../../components/general/sidebar/sidebarContext';
import { PanelTitle } from '../../components/general/sidebar/style';
import TreeExplorer, { FromTreeNodeFunction } from '../../components/general/tree';
import { defaultEntityInformationService, defaultTreeStructureService } from '../../lib/context';
import ExplorerDataDocument from '../../lib/domain/entities/sidebarData/explorerData';
import EntityInformation from '../../lib/domain/entities/tabData/entityInformation';
import GenericAsFileSession from '../../lib/domain/entities/tabData/genericDataFileSession';
import { EntityType } from '../../lib/domain/enums/entityType';
import EntityInformationService from '../../lib/services/entityInformationService';
import TreeStructureService from '../../lib/services/treeStructureService';
import { AuthContext } from '../../page/authContext';
import OpenFiles from './openFiles/openFiles';
import { FileExplorerIsDirectory, FileExplorerNodeStyleGenerator } from './style';
import { EntityTreeRoot, ProductRoot, StructureRoot } from './treeRoots';

const ExplorerPanel = ({
    treeStructureService,
    entityInformationService,
}: {
    treeStructureService: TreeStructureService;
    entityInformationService: EntityInformationService;
}) => {
    const dispatch = useTabActions();
    const [openedTree, setOpenedTree] = useState('Open View');
    const { load } = useContext(TabLoadingContext);
    const { auth } = useContext(AuthContext);
    const { data, editSidebarData } = useContext(SidebarContext);

    if (!(data instanceof ExplorerDataDocument)) {
        return null;
    }

    const openFile = load(async ({ node }: FromTreeNodeFunction) => {
        const entityInformation: EntityInformation = await entityInformationService.getEntityInformation(
            node.entityType,
            node.ruleGuid,
            node.fileType,
        );

        if ((node.entityType as EntityType) !== 'DATA_FILE') {
            entityInformation.folderType = node.folderType;
            dispatch({ type: OPEN, payload: { data: entityInformation } });
        } else {
            const entityLevelKey = 'EntityLevel';
            const session = new GenericAsFileSession();
            session.fileGuid = entityInformation.getGuid();
            session.name = entityInformation.getName();
            session.entityLevel = entityInformation.extras[entityLevelKey];
            session.xmlData = entityInformation.dataString;
            session.saved = true;

            dispatch({ type: OPEN, payload: { data: session } });
        }
    });

    const filterEntityFromVersionOipa = (): TreeItem[] => {
        if (auth.oipaVersion !== '113') {
            const er = EntityTreeRoot.filter((element) => {
                return element.title !== 'Quote Definition';
            });
            return er;
        }
        return EntityTreeRoot;
    };

    return (
        <>
            <PanelTitle>Explorer</PanelTitle>
            <OpenFiles openedTree={openedTree} setOpenedTree={setOpenedTree} />
            <TreeExplorer
                rootNodes={StructureRoot}
                containerTitle="Structure Explorer"
                fetchChildren={treeStructureService.loadStructureTree}
                clickFile={openFile}
                openedTree={openedTree}
                setOpenedTree={setOpenedTree}
                updateDataStore={(tree) =>
                    editSidebarData<ExplorerDataDocument>((draft) => {
                        draft.dataStructureTreeItem = tree;
                    })
                }
                dataStoreTree={data.dataStructureTreeItem}
                generateNodeProps={FileExplorerNodeStyleGenerator}
                nodeIsDirectory={FileExplorerIsDirectory}
            />

            <TreeExplorer
                rootNodes={filterEntityFromVersionOipa()}
                containerTitle="Entities Explorer"
                fetchChildren={treeStructureService.loadEntityTree}
                clickFile={openFile}
                openedTree={openedTree}
                setOpenedTree={setOpenedTree}
                updateDataStore={(tree) =>
                    editSidebarData<ExplorerDataDocument>((draft) => {
                        draft.dataEntityTreeItem = tree;
                    })
                }
                dataStoreTree={data.dataEntityTreeItem}
                generateNodeProps={FileExplorerNodeStyleGenerator}
                nodeIsDirectory={FileExplorerIsDirectory}
            />

            <TreeExplorer
                rootNodes={ProductRoot}
                containerTitle="Product Explorer"
                fetchChildren={treeStructureService.loadProductTree}
                clickFile={openFile}
                openedTree={openedTree}
                setOpenedTree={setOpenedTree}
                updateDataStore={(tree) =>
                    editSidebarData<ExplorerDataDocument>((draft) => {
                        draft.dataProductTreeItem = tree;
                    })
                }
                dataStoreTree={data.dataProductTreeItem}
                generateNodeProps={FileExplorerNodeStyleGenerator}
                nodeIsDirectory={FileExplorerIsDirectory}
            />
        </>
    );
};

ExplorerPanel.defaultProps = {
    treeStructureService: defaultTreeStructureService,
    entityInformationService: defaultEntityInformationService,
};

export default ExplorerPanel;
