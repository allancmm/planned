import {Loading} from 'equisoft-design-ui-elements';
import React, {useMemo, useRef, useState} from 'react';
import SortableTree, { changeNodeAtPath, TreeItem } from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import {FromTreeNodeFunction, NumberOrStringArray} from '../../general/tree';
import {LoadingContainer, NoResultContainer, TreeContainer} from './style';
import NoRecordsFound from "../../general/noRecordsFound";

interface ConfigPackageContentProps {
    rootNodes: TreeItem[];
    dataStoreTree?: TreeItem[];
    loading?: boolean;
    updateDataStore?(tree: TreeItem[]): void;
    fetchChildrens?(data: FromTreeNodeFunction): Promise<TreeItem[]>;
    clickFile(data: FromTreeNodeFunction): void;
    generateNodeProps(node: TreeItem): any;
    nodeIsDirectory(node: TreeItem): boolean;
}

const ConfigPackageContent = ({
                                  rootNodes, fetchChildrens, clickFile, dataStoreTree, loading, updateDataStore, generateNodeProps, nodeIsDirectory
}: ConfigPackageContentProps) => {
    const generateBasicTree = () =>
        rootNodes.map((r) => ({
            children: ({ done, node, path }: any) => fetchChildrens?.({ node, path, treeRef, getNodeKey }).then(done),
            ...r, // deconstruct after so children can be overridden
        }));

    const [tree, setTree] = useState<TreeItem[]>(generateBasicTree());

    const treeRef = useRef(tree);

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

    const configPackageTree = useMemo(() => {
        if (!dataStoreTree || dataStoreTree.length === 0) {
            return tree;
        } else {
            if (tree !== dataStoreTree) {
                setTree(dataStoreTree);
                treeRef.current = dataStoreTree;
            }
            return dataStoreTree;
        }
    } , [dataStoreTree, tree]);

    const getNodeKey = ({ node }: { node: TreeItem }) => node.id;
    return (
        <>
            <LoadingContainer>
                <Loading loading={loading} />
            </LoadingContainer>
            {configPackageTree.length > 0 ?
                <TreeContainer>
                    <SortableTree
                        treeData={configPackageTree}
                        onChange={handleTreeChange}
                        getNodeKey={getNodeKey}
                        theme={FileExplorerTheme}
                        innerStyle={{ padding: '4px' }}
                        generateNodeProps={({node, path}) => ({
                            ...generateNodeProps(node),
                            onClick: () => handleRowClick(node, path),
                        })}
                    />
                </TreeContainer> :
                <NoResultContainer>
                    <NoRecordsFound />
                </NoResultContainer>
            }
        </>
    );
};

export default ConfigPackageContent;
