import {immerable} from 'immer';

export class AutomatedTestTreeNode {
    [immerable] = true;

    type: string = '';
    name: string = '';
    path: string = '';

    public parent?: AutomatedTestTreeNode;
    public children?: AutomatedTestTreeNode[] = [];

    constructor(type?: string) {
        this.type = type? type : '';
    }
}
