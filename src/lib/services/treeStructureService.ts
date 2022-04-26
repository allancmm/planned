import { TreeItem } from 'react-sortable-tree';
import { FromTreeNodeFunction } from '../../components/general/tree';
import TreeRepository from '../domain/repositories/treeRepository';

export default class TreeStructureService {
    constructor(private treeRepository: TreeRepository) {}

    loadStructureTree = async (data: FromTreeNodeFunction): Promise<TreeItem[]> => {
        const d = await this.treeRepository.loadStructureTree(data);
        return this.handleNodes(d, data, this.loadStructureTree);
    };

    loadEntityTree = async (data: FromTreeNodeFunction): Promise<TreeItem[]> => {
        const d = await this.treeRepository.loadEntityTree(data);
        return this.handleNodes(d, data, this.loadEntityTree);
    };

    loadProductTree = async (data: FromTreeNodeFunction): Promise<TreeItem[]> => {
        const d = await this.treeRepository.loadProductTree(data);
        return this.handleNodes(d, data, this.loadProductTree);
    };

    private handleNodes = (
        nodes: TreeItem[],
        data: FromTreeNodeFunction,
        recursionMethod: (data: FromTreeNodeFunction) => Promise<TreeItem[]>,
    ) => {
        return nodes
            .sort((a, b) => +a.isDirectory - +b.isDirectory || +b.isPrimStructure - +a.isPrimStructure)
            .map((dd) => {
                if (dd.isDirectory) {
                    dd.children = ({ done, node: n, path: p }) =>
                        recursionMethod({
                            node: n,
                            path: p,
                            treeRef: data.treeRef,
                            getNodeKey: data.getNodeKey,
                        }).then(done);
                }
                return dd;
            });
    };
}
