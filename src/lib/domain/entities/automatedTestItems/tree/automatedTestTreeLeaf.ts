import { AutomatedTestTreeNode } from './automatedTestTreeNode';
import { immerable } from 'immer';

export default class AutomatedTestTreeLeaf extends AutomatedTestTreeNode {
    [immerable] = true;

    public type: string = 'LEAF';
    public name: string = '';
    public path: string = '';
}
