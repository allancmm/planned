import { AutomatedTestTreeNode } from './automatedTestTreeNode';
import { Type } from 'class-transformer';
import AutomatedTestTreeLeaf from './automatedTestTreeLeaf';
import { immerable } from 'immer';

export default class AutomatedTestTreeFolder extends AutomatedTestTreeNode {
    [immerable] = true;

    public type: string = 'FOLDER';
    public name: string = '';
    public path: string = '';
    @Type(() => AutomatedTestTreeFolder, {
        keepDiscriminatorProperty: true,
        discriminator: {
            property: 'type',
            subTypes: [
                { value: AutomatedTestTreeFolder, name: 'FOLDER' },
                { value: AutomatedTestTreeLeaf, name: 'LEAF' },
            ],
        },
    })
    public children: AutomatedTestTreeNode[] = [];
}
