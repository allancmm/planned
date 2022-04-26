import React, {FormEvent, ReactNode, useContext, useEffect, useState} from 'react';
import {useModal} from "@equisoft/design-elements-react";
import { Button, useDialog, useLoading } from 'equisoft-design-ui-elements';
import produce, { Draft } from 'immer';
import { addNodeUnderParent, changeNodeAtPath, find, getNodeAtPath, NodeData, removeNodeAtPath, TreeItem, walk } from 'react-sortable-tree';
import {toast} from 'react-toastify';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import {ModalDialog} from '../../../components/general';
import {notifyError} from '../../../components/general/error';
import ActionNavButton from '../../../components/general/sidebar/actionNav/actionNavButton';
import { ActionNav, ActionNavItem, NavItem } from '../../../components/general/sidebar/actionNav/style';
import TreeExplorer, {NumberOrStringArray} from '../../../components/general/tree';
import { defaultAutomatedTestService } from '../../../lib/context';
import { ErrorInformation } from '../../../lib/domain/entities/apiError';
import FunctionalTestSession from '../../../lib/domain/entities/tabData/functionalTestSession';
import AutomatedTestService from '../../../lib/services/automatedTestService';
import ModalAddToTestSuite from '../modal';
import { SidebarContext } from "../../../components/general/sidebar/sidebarContext";
import { ContainerTreeExplorer, AddFolderIcon, CancelIcon, CheckIcon, NodeIsDirectory, NodeStyleGenerator, RightButton } from './style';

interface AutomatedTestTreeProps {
    automatedTestService: AutomatedTestService;
}

const AutomatedTestTree = ({ automatedTestService }: AutomatedTestTreeProps) => {
    const [tree, setTree] = useState<TreeItem>({});
    const [nodeName, setNodeName] = useState('');
    const [dialogProps, setDialogProps] = useState({});
    const [loading, load] = useLoading();
    const [showMenu, toggleMenu] = useDialog();
    const [editNode, setEditNode] = useState<TreeItem>();
    const [modalAddToTestSuiteProps, setModalAddToTestSuiteProps] = useState({});
    const dispatch = useTabActions();
    const { refreshSidebar } = useContext(SidebarContext);

    const updateTree = (recipe: (draft: Draft<TreeItem>) => void) => {
        setTree(produce(tree, recipe));
    };

    useEffect(() => {
        fetchFunctionalTests();
        if(!showMenu) {
            toggleMenu();
        }
    }, [refreshSidebar]);

    const fetchFunctionalTests = load(async () => {
        const node : TreeItem = await automatedTestService.getAutomatedTestTreeItems();
        updateTree((draft: Draft<TreeItem>) => {
            draft.name = node.name;
            draft.path = node.path;
            draft.type = node.type;
            draft.children = node.children;
        });
    });

    const reloadExpandedTree = async() => {
        const expandedTreeItems: string[] = [];
        walk({
            treeData: tree.children as TreeItem[],
            getNodeKey: ({ node }) => node.id,
            callback: (nodeData: NodeData) => {
                if(nodeData.node.expanded) {
                    expandedTreeItems.push(nodeData.node.id);
                }
            },
        });
        const rootNode = await automatedTestService.getAutomatedTestTreeItems();
        walk({
            treeData: rootNode.children as TreeItem[],
            getNodeKey: ({ node }) => node.id,
            callback: (nodeData: NodeData) => {
                nodeData.node.expanded = (expandedTreeItems.includes(nodeData.node.id));
            },
        });
        updateTree((draft) => {
            draft.children = rootNode.children;
        });
        if(!showMenu) {
            toggleMenu();
        }
    }

    const submitNodeChange = load(async () => {
        if(isValidNodeChange()) {
            if(isCreateMode()) {
                editNode?.isDirectory ? await automatedTestService.createFolder(editNode?.parentPath + '@@' + nodeName)
                    : await automatedTestService.createTestCase(nodeName, editNode?.parentPath);
            } else if(isRenameMode() && nodeName !== editNode?.currentName) {
                await automatedTestService.moveNode(editNode?.id, nodeName);
            } else if(isCopyMode()) {
                await automatedTestService.copyTestCase(editNode?.parentPath, editNode?.currentName, nodeName);
            }
            reloadExpandedTree();
        }
    });

    const handleMoveNode = load(async ({ node, nextParentNode }: { node: TreeItem, nextParentNode: TreeItem }) => {
        await automatedTestService.moveNode(node?.id, node.title?.toString() ?? '', nextParentNode?.id ?? tree.path);
        reloadExpandedTree();
    });

    const canDrop = ({ node, nextParent, prevPath, nextPath }:
                         { node: TreeItem, nextParent: TreeItem, prevPath: NumberOrStringArray, nextPath: NumberOrStringArray }) => {
        return !((nextParent?.children as TreeItem[])?.filter(n => n.title === node.title).length > 1)
            && JSON.stringify(prevPath) !== JSON.stringify(nextPath);
    };

    const isCreateMode = () => editNode?.action === 'create';
    const isRenameMode = () => editNode?.action === 'rename';
    const isCopyMode = () => editNode?.action === 'copy';

    const isValidNodeChange = () => {
        if(nodeName === '') {
            const errorInformation: ErrorInformation = {
                message: editNode?.isDirectory ? 'Folder name should not be empty' : 'Testcase name should not be empty',
                extraInformation: ''
            };
            notifyError(errorInformation);
            return false;
        }
        return true;
    };

    const titleInput = (value?: string) => {
        return <input type={'text'} autoFocus  defaultValue={value}
                      onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                      }}
                      onChange={(e) => setNodeName(e.target.value)} />;
    }

    const createFolder = async (rowInfo?: TreeItem) => {
        const newNode = { title: titleInput(''), isDirectory: true, expanded: false, parentPath: rowInfo?.id ?? tree.path, action: 'create'};
        const newTree = addNodeUnderParent({
            treeData: tree.children as TreeItem[],
            newNode: newNode,
            expandParent: true,
            parentKey: rowInfo?.id,
            getNodeKey: ({ node }) => node.id,
        });
        setEditNode(newNode);
        toggleMenu();
        updateTree((draft) => {
            draft.children = newTree.treeData;
        });
    };

    const createFile = async (rowInfo: TreeItem) => {
        const newNode = { title: titleInput(''), isDirectory: false, expanded: false, parentPath: rowInfo.id, action: 'create'};
        const newTree = addNodeUnderParent({
            treeData: tree.children as TreeItem[],
            newNode: newNode,
            expandParent: true,
            parentKey: rowInfo?.id,
            getNodeKey: ({ node }) => node.id,
        });
        setEditNode(newNode);
        toggleMenu();
        updateTree((draft) => {
            draft.children = newTree.treeData;
        });
    };

    const copyFile = async (rowInfo: TreeItem) => {
        const sourceNodePath = find({
            treeData: tree.children as TreeItem[],
            getNodeKey: ({ node }) => node.id,
            searchQuery: rowInfo.id,
            searchMethod: ({ node, searchQuery }) => node.id === searchQuery,
        }).matches[0].path;

        const parentNodePath = sourceNodePath.slice();
        parentNodePath.splice(-1, 1);

        const parentNode = getNodeAtPath({
            treeData: tree.children as TreeItem[],
            path: parentNodePath,
            getNodeKey: ({ node }) => node.id,
        })?.node;

        const newNode = { title: titleInput(rowInfo.title?.toString()), isDirectory: false, expanded: false, parentPath: parentNode?.id,
            action: 'copy', currentName: rowInfo.title?.toString() };

        const newTree = addNodeUnderParent({
            treeData: tree.children as TreeItem[],
            newNode: newNode,
            expandParent: true,
            parentKey: parentNode?.id,
            getNodeKey: ({ node }) => node.id,
        });

        setEditNode(newNode);
        toggleMenu();
        updateTree((draft) => {
            draft.children = newTree.treeData;
        });
    };

    const deleteTestCase = async (rowInfo: TreeItem) => {
        const nodePath = find({
            treeData: tree.children as TreeItem[],
            getNodeKey: ({ node }) => node.id,
            searchQuery: rowInfo.id,
            searchMethod: ({ node, searchQuery }) => node.id === searchQuery,
        }).matches[0].path;

        const newTree = removeNodeAtPath({
            treeData: tree.children as TreeItem[],
            path: nodePath,
            getNodeKey: ({ node }) => node.id,
        });

        await automatedTestService.deleteTestCase(rowInfo.id, NodeIsDirectory(rowInfo));

        updateTree((draft) => {
            draft.children = newTree;
        });
        closeDialog();
    };

    const renameNode = async(rowInfo: TreeItem) => {
        const currentName = rowInfo.title?.toString();
        const result = find({
            treeData: tree.children as TreeItem[],
            getNodeKey: ({ node }) => node.id,
            searchQuery: rowInfo.id,
            searchMethod: ({ node, searchQuery }) => node.id === searchQuery,
        })
        const newTree = changeNodeAtPath( {
            treeData: tree.children as TreeItem[],
            path: result.matches[0].path,
            newNode: {...rowInfo, title: titleInput(currentName)},
            getNodeKey: ({ node }) => node.id,
        });
        setEditNode({...rowInfo, action: 'rename', currentName: currentName});
        toggleMenu();
        updateTree((draft) => {
            draft.children = newTree;
        });
    }

    const openFunctionalTestCase = ({ node }: { node: TreeItem }) => {
        const session = new FunctionalTestSession();
        session.testCasePath = node.id;
        session.testCaseName = node.title?.toString() ?? '';
        dispatch({ type: OPEN, payload: { data: session } });
    };

    const actionBar = (node: TreeItem) => {
        return (showMenu) ? <ActionNav>
            <ActionNavItem>
                <NavItem onClick={(e) => e?.stopPropagation()}>{'...'}</NavItem>
                <ul>
                    <li>
                        <ActionNavButton onClick={(e) => {
                            e?.stopPropagation();
                            renameNode(node);
                        }} title={'Rename'} />
                    </li>
                    { NodeIsDirectory(node) ?
                        <>
                            <li>
                                <ActionNavButton onClick={(e) => {
                                    e?.stopPropagation();
                                    createFolder(node);
                                }} title={'Add subfolder'} />
                            </li>
                            <li>
                                <ActionNavButton onClick={(e) => {
                                    e?.stopPropagation();
                                    createFile(node);
                                }} title={'Add testcase'} />
                            </li>
                            <li>
                                <ActionNavButton onClick={(e) => {
                                    e?.stopPropagation();
                                    if (NodeIsDirectory(node) && node.children && node.children.length > 0) {
                                        toast.error("Cannot delete folder - Folder is not empty");
                                        return;
                                    }
                                    openDialog(
                                        <div>
                                            Are you sure you want to delete testcase folder <b>{node.title}</b> ?
                                        </div>,
                                        () => deleteTestCase(node),
                                    );
                                }} title={'Delete'} />
                            </li>
                        </>
                        : <>
                            <li>
                                <ActionNavButton onClick={(e) => {
                                    e?.stopPropagation();
                                    copyFile(node);
                                }} title={'Duplicate'} />
                            </li>
                            <li>
                                <ActionNavButton onClick={(e) => {
                                    e?.stopPropagation();
                                    openDialog(
                                        <div>
                                            Are you sure you want to delete testcase <b>{node.title}</b> ?
                                        </div>,
                                        () => deleteTestCase(node),
                                    );
                                }} title={'Delete'} />
                            </li>
                            <li>
                                <ActionNavButton onClick={ (e) => handleClickOpenModal(e, openModalAddToTestSuite, node)}
                                                 title={'Add to suite'} />
                            </li>
                        </>
                    }
                </ul>
            </ActionNavItem>
        </ActionNav>
            : (editNode?.id === node?.id) ?
                <>
                    <RightButton buttonType="tertiary" onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        reloadExpandedTree();
                    }}>
                        <CancelIcon/>
                    </RightButton>
                    <RightButton type="submit" buttonType="tertiary" onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        submitNodeChange();
                    }}>
                        <CheckIcon/>
                    </RightButton>
                </>
                : null;
    }

    const panelButton = () => {
        return (showMenu) ? <Button
                buttonType="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    createFolder(tree);
                }}>
                <AddFolderIcon />
            </Button>
            : null;
    }

    const {
        isModalOpen,
        closeModal,
        openModal,
    } = useModal();

    const openDialog = (element: ReactNode, onConfirm: () => void) => {
        openModal();
        setDialogProps({
            children: element,
            confirmButton: { onConfirm },
            title: 'Confirmation Required',
        });
    };

    const closeDialog = () => {
        closeModal();
        setDialogProps({});
    };

    const getDialogProps = () => {
        return {
            isOpen: isModalOpen,
            onRequestClose: closeDialog,
            children: <></>,
            ...dialogProps,
        };
    };

    const {
        isModalOpen : isModalAddToTestSuiteOpen,
        closeModal: closeModalAddToTestSuite,
        openModal : openModalAddToTestSuite,
    } = useModal();

    const getModalAddToTestSuiteProps = () => {
        return {
            isModalAddToTestSuiteOpen,
            closeModal: closeModalAddToTestSuite,
            currentTestCase: <></>,
            onConfirm: () => {},
            ...modalAddToTestSuiteProps,
        };
    };

    const handleClickOpenModal = (e: FormEvent<HTMLAnchorElement>, open : () => void, node: TreeItem) => {
        e.stopPropagation();
        open();
        setModalAddToTestSuiteProps({currentTestCase: node});
    }

    return (
        <>
            <ModalDialog {...getDialogProps()} />

            <ContainerTreeExplorer>
                <TreeExplorer
                    rootNodes={[]}
                    containerTitle="Test Cases"
                    dataStoreTree={(tree.children as TreeItem[]) ?? []}
                    clickFile={openFunctionalTestCase}
                    generateNodeProps={(node) => NodeStyleGenerator(node, actionBar(node))}
                    nodeIsDirectory={NodeIsDirectory}
                    loading={loading}
                    canRefresh={false}
                    panelButton={panelButton()}
                    canDrag
                    canDrop={canDrop}
                    canNodeHaveChildren={(node) => node.isDirectory}
                    onMoveNode={handleMoveNode}
                    updateDataStore={(t) =>
                        updateTree((draft) => {
                            draft.children = t;
                        })
                    }
                />
                {isModalAddToTestSuiteOpen && <ModalAddToTestSuite {...getModalAddToTestSuiteProps()}/>}
            </ContainerTreeExplorer>
        </>
    );
};

AutomatedTestTree.defaultProps = {
    automatedTestService: defaultAutomatedTestService,
};

export default AutomatedTestTree;
