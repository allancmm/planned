import { TreeItem } from 'react-sortable-tree';
import { ISidebarData } from './iSidebarData';

export default class ExplorerDataDocument extends ISidebarData {
    clazz: string = 'ExplorerDataDocument';

    public dataStructureTreeItem: TreeItem[] = [];
    public dataEntityTreeItem: TreeItem[] = [];
    public dataProductTreeItem: TreeItem[] = [];
}
