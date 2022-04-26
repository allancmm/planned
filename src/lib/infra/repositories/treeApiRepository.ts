import { getNodeAtPath, TreeItem } from 'react-sortable-tree';
import { FromTreeNodeFunction } from '../../../components/general/tree';
import TreeRepository from '../../domain/repositories/treeRepository';
import { ApiGateway } from '../config/apiGateway';
import TreeNodeRequest from '../request/treeNodeRequest';

export default class TreeApiRepository implements TreeRepository {
    constructor(private api: ApiGateway) {}

    loadStructureTree = async (data: FromTreeNodeFunction): Promise<TreeItem[]> => {
        const req = this.getRequest(data);
        return this.api.postReturnArray('/tree/structure', req, { inType: TreeNodeRequest }); // outType tree item is an interface, just believe its correct
    };

    loadEntityTree = async (data: FromTreeNodeFunction): Promise<TreeItem[]> => {
        const req = this.getRequest(data);
        return this.api.postReturnArray('/tree/entity', req, { inType: TreeNodeRequest }); // outType tree item is an interface, just believe its correct
    };

    loadFunctionalTestTree = async (data: FromTreeNodeFunction): Promise<TreeItem[]> => {
        const req = this.getRequest(data);
        return this.api.postReturnArray('/tree/entity', req, { inType: TreeNodeRequest }); // outType tree item is an interface, just believe its correct
    };

    loadProductTree = async (data: FromTreeNodeFunction): Promise<TreeItem[]> => {
        const req = this.getRequest(data);
        return this.api.postReturnArray('/tree/product', req, { inType: TreeNodeRequest }); // outType tree item is an interface, just believe its correct
    };

    private getRequest = ({
        node: { folderType, ruleGuid, title },
        path,
        treeRef,
        getNodeKey,
    }: FromTreeNodeFunction) => {
        const req: TreeNodeRequest = { folderType, ruleGuid, nodeName: title as string };
        if (path.length > 1) {
            const parent = getNodeAtPath({
                treeData: treeRef.current,
                path: path.slice(0, path.length - 1),
                getNodeKey,
            });
            if (parent) {
                req.parentType = parent.node.folderType;
                req.parentGuid = parent.node.ruleGuid;
            }
        }

        return req;
    };
}
