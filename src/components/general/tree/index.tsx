import { Button, CollapseContainer, Loading } from 'equisoft-design-ui-elements';
import React, { MutableRefObject, useContext, useEffect, useMemo, useRef, useState } from 'react';
import SortableTree, { changeNodeAtPath, TreeItem } from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import { RefreshTreeIcon, TreeContainer } from './style';
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { SidebarContext } from '../sidebar/sidebarContext';

const useStyles = makeStyles(() =>
    createStyles({
        tree: {
            '& button': {
                display: 'none'
            },
        }
    }),
);

interface StructureExplorerProps {
    rootNodes: TreeItem[];
    containerTitle: string;
    openedTree?: string;
    dataStoreTree?: TreeItem[];
    loading?: boolean;
    canRefresh?: boolean;
    panelButton?: React.ReactElement|null;
    canDrag?: boolean;
    canDrop?(data: { node: TreeItem, nextParent: TreeItem | null, prevPath: NumberOrStringArray, nextPath: NumberOrStringArray }): boolean;
    canNodeHaveChildren?(node: TreeItem): boolean;
    onMoveNode?(data: { node: TreeItem, nextParentNode: TreeItem | null }): void;
    setOpenedTree?(s: string): void;
    updateDataStore?(tree: TreeItem[]): void;
    fetchChildren?(data: FromTreeNodeFunction): Promise<TreeItem[]>;
    clickFile(data: FromTreeNodeFunction): void;
    generateNodeProps(node: TreeItem): any;
    nodeIsDirectory(node: TreeItem): boolean;
}

export type NumberOrStringArray = (string | number)[];
export interface FromTreeNodeFunction {
    node: TreeItem;
    path: NumberOrStringArray;
    treeRef: MutableRefObject<TreeItem[]>;
    getNodeKey(data: { node: TreeItem }): string;
}

const TreeExplorer = ({
    rootNodes,
    fetchChildren,
    containerTitle,
    clickFile,
    openedTree = containerTitle,
    setOpenedTree,
    dataStoreTree,
    updateDataStore,
    generateNodeProps,
    nodeIsDirectory,
    loading = false,
    canRefresh = true,
    panelButton,
    canDrag = false,
    canDrop = () => false,
    canNodeHaveChildren,
    onMoveNode
}: StructureExplorerProps) => {
    const { refreshSidebar, toggleRefreshSidebar } = useContext(SidebarContext);

    const generateBasicTree = () =>
        rootNodes.map((r) => {
            const children = ({ done, node, path }: any) =>
                fetchChildren?.({ node, path, treeRef, getNodeKey }).then(done)
            return {
                ...r,  // deconstruct after so children can be overridden
                children,
            }
        });

    const [tree, setTree] = useState<TreeItem[]>(generateBasicTree());
    const treeRef = useRef(tree);

    const [isEntityDeleted, setEntityDeleted] = useState(false);

    useEffect(() => {
        if(refreshSidebar) {
            handleTreeChange(generateBasicTree());
            setEntityDeleted(true);
            toggleRefreshSidebar();
        }
    }, [refreshSidebar]);

    const handleRowClick = (node: TreeItem, path: NumberOrStringArray) => {
        if (nodeIsDirectory(node)) {
            handleTreeChange(
                changeNodeAtPath({
                    treeData: tree,
                    path,
                    newNode: ({ node: n }: any) => ({ ...n, expanded: !n.expanded }),
                    getNodeKey,
                }),
            );
        } else {
            clickFile({ node, path, treeRef, getNodeKey });
        }
    };

    const handleTreeChange = (treeData: TreeItem[]) => {
        updateDataStore?.(treeData);
        treeRef.current = treeData;
        setTree(treeData);
    };
    const loadTree = useMemo((): TreeItem[] => {
        if (!dataStoreTree || dataStoreTree.length === 0 || isEntityDeleted) {
            return tree;
        }
        if (tree !== dataStoreTree) {
            setTree(dataStoreTree);
            treeRef.current = dataStoreTree;
        }
        return dataStoreTree;
    }, [dataStoreTree, tree, isEntityDeleted]);

    const refreshButton = () => {
        return <Button
            buttonType="icon"
            onClick={(e) => {
                e.stopPropagation();
                handleTreeChange(generateBasicTree());
            }}
        >
            <RefreshTreeIcon />
        </Button>
    }

    const classes = useStyles();

    const getNodeKey = ({ node }: { node: TreeItem }) => node.id;
    return (
        <CollapseContainer
            title={containerTitle}
            open={openedTree === containerTitle}
            toggleOpen={() => setOpenedTree?.(containerTitle)}
            actions={<>
                {canRefresh ? refreshButton() : null}
                {panelButton}
                </>
            }
        >
            <>
                <Loading loading={loading} />
                <>
                    <TreeContainer id='tree-container'>
                        <SortableTree
                            treeData={loadTree}
                            onChange={handleTreeChange}
                            getNodeKey={getNodeKey}
                            canDrag={canDrag}
                            canDrop={canDrop}
                            canNodeHaveChildren={canNodeHaveChildren}
                            onMoveNode={onMoveNode}
                            theme={FileExplorerTheme}
                            innerStyle={{ padding: '4px' }}
                            generateNodeProps={({ node, path }) => ({
                                ...generateNodeProps(node),
                                onClick: () => handleRowClick(node, path),
                            })}
                            className={classes.tree}
                        />
                    </TreeContainer>
                </>
            </>
        </CollapseContainer>
    );
};

export default TreeExplorer;
