import { TreeItem } from 'react-sortable-tree';
import {AutomatedTestTreeNode} from '../../domain/entities/automatedTestItems/tree/automatedTestTreeNode';

export const fromAutomatedTestTreeNode = (node: AutomatedTestTreeNode) :TreeItem => ({
    id: node.path,
    title: node.name,
    children: [
        ...(node.children?.map(fromAutomatedTestTreeNode) ?? []),
    ],
    path: node.path,
    isDirectory: node.type === 'FOLDER',
    expanded: false,
});
