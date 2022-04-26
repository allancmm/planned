import { TreeItem } from 'react-sortable-tree';
import { FromTreeNodeFunction } from '../../../components/general/tree';

export default interface TreeRepository {
    loadStructureTree(data: FromTreeNodeFunction): Promise<TreeItem[]>;

    loadEntityTree(data: FromTreeNodeFunction): Promise<TreeItem[]>;

    loadFunctionalTestTree(data: FromTreeNodeFunction): Promise<TreeItem[]>;

    loadProductTree(data: FromTreeNodeFunction): Promise<TreeItem[]>;
}
