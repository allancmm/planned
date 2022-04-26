import { faFile, faFolder, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { Button, Loading } from 'equisoft-design-ui-elements';
import React, { Fragment } from 'react';
import { TreeItem } from 'react-sortable-tree';
import styled from 'styled-components';
import TypeBadge from '../../components/general/sidebar/entitySummary/entityTypeBadge';
import { Separator, TreeFileIcon } from '../../components/general/tree/style';
import ConfigPackage from '../../lib/domain/entities/configPackage';
import { VersionType } from '../../lib/domain/enums/versionTypes';

const FolderContent = styled.div`
    margin-top: 3px
`;

export const FileExplorerIsDirectory = (node: TreeItem) => node.isDirectory;
export const FileExplorerNodeStyleGenerator = (node: TreeItem) => ({
    icons: FileExplorerIsDirectory(node)
        ? [
              <FolderContent key="Folder">
                  <TreeFileIcon
                      icon={node.expanded ? faFolderOpen : faFolder}
                      color={node.isPrimStructure ? 'royalblue' : 'darkorange'}
                  />
                  {node.entityType && <TypeBadge type={node.entityType} />}
              </FolderContent>,
          ]
        : !node.isSeparator
        ? [<TreeFileIcon key="File" icon={faFile} color={node.isPrimStructure ? 'lightblue' : 'orange'} />]
        : [<Separator key="Separator" />],
    buttons:
        typeof node.children === 'function' && node.expanded
            ? [
                  <div key="loading" style={{ width: '25px' }}>
                      <Loading loading />
                  </div>,
              ]
            : [<></>],
    style: { cursor: `${node.isSeparator ? '' : 'pointer'}` },
});

export const ConfigPkgIsDirectory = (node: TreeItem) =>
    (['FOLDER', 'DELETEDFOLDER', 'DUMMY'] as VersionType[]).includes(node.nodeType);
export const ConfigPkgContentNodeStyleGenerator = (node: TreeItem, removeVersion: (versionGuid: string) => void, pkg: ConfigPackage) => ({
    icons: ConfigPkgIsDirectory(node)
        ? [
              <Fragment key="Folder">
                  <TreeFileIcon icon={node.expanded ? faFolderOpen : faFolder} color={'orange'} />
                  {node.entityType && <TypeBadge type={node.entityType} />}
              </Fragment>,
          ]
        : [<TreeFileIcon key="File" icon={faFile} color={'orange'} />],
    buttons: [
        node.versionNumber === 0 && node.versionGuid && (pkg.isInReworkNeeded() || pkg.isOpen()) ? (
            <XButton label="X" buttonType="tertiary" onClick={() => removeVersion(node.versionGuid)} />
        ) : (
            <></>
        ),
    ],
    style: { ...getStyleFromNodeType(node.nodeType), cursor: 'pointer' },
});

const XButton = styled(Button)`
    min-height: unset;
    padding: 0;
    line-height: unset;
`;

const getStyleFromNodeType = (type: VersionType): React.CSSProperties => {
    switch (type) {
        case 'DELETEDFOLDER':
        case 'DELETEDITEM':
            return { color: 'red', fontWeight: 'bold' };
        case 'NEWITEM':
            return { color: 'green', fontWeight: 'bold' };
        case 'MODIFIEDITEM':
            return { color: 'blue', fontWeight: 'bold' };
        case 'UNMODIFIEDITEM':
        case 'FOLDER':
        case 'DUMMY':
            return {};
    }
};
