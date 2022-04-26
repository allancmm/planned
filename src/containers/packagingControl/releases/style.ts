import { ActionIcon } from 'equisoft-design-ui-elements';
import {BookOpen, Database, Download } from 'react-feather';
import styled from 'styled-components';

export const ReleasesTable = styled.div`
    width: 100%;
    padding: 6px 12px 16px;
    
    & input {
       width: 100% !important;
       margin-top: 12px;
    }
`;

export const DatabaseIcon = styled(Database)`
    ${ActionIcon}
`;

export const DownloadIcon = styled(Download)`
    ${ActionIcon}
`;

export const ManifestIcon = styled(BookOpen)`
    ${ActionIcon}
`;
