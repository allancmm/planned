
import {faFile, faFolder, faFolderOpen} from '@fortawesome/free-solid-svg-icons';
import {Button} from 'equisoft-design-ui-elements';
import React, {Fragment} from 'react';
import {Check, Plus, X} from 'react-feather';
import {TreeItem} from 'react-sortable-tree';
import styled, {css} from 'styled-components';
import {TreeFileIcon} from '../../../components/general/tree/style';

export const ContainerTreeExplorer = styled.div`
   #tree-container {
      height: 40vh;
      
   }

   .ReactVirtualized__Grid__innerScrollContainer {
        overflow: initial !important;
    }

    .rstcustom__rowWrapper:hover {
        opacity: 1;
    }

    .elliptic > div > .rstcustom__rowLabel {
        flex: 1 1 auto;
        padding-right: 0px;
    }

    .elliptic > div > .rstcustom__rowLabel:hover {
        opacity: 0.7;
    }
`;
export const NodeIsDirectory = (node: TreeItem) => node.isDirectory;
export const NodeStyleGenerator = (node: TreeItem, actionBar: JSX.Element|null) => ({
    icons: NodeIsDirectory(node)
        ? [
            <Fragment key="Folder">
                <TreeFileIcon
                    icon={node.expanded ? faFolderOpen : faFolder}
                    color='darkorange'
                />
            </Fragment>,
        ]
        : [<TreeFileIcon key="File" icon={faFile} color={node.isPrimStructure ? 'lightblue' : 'orange'} />],
    buttons: [actionBar],
    style: { cursor: 'pointer', width: '100%'},
    className: 'elliptic'
});

const icon = css`
    height: 12px;
    width: 12px;
    margin-right: 5px;
`;

export const AddFolderIcon = styled(Plus)`
    width: 15px;
    height: 15px;
`;

export const CheckIcon = styled(Check)`
    ${icon};
    color: green !important;
`;

export const CancelIcon = styled(X)`
    ${icon};
`;

export const RightButton = styled(Button)`
    float: right;
    display: block !important;
`;
