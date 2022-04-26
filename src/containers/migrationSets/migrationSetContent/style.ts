import styled from 'styled-components';
import { IconMenuStyle } from "../../../components/general/popOverMenu";
import { Clock, FileText, Trash, RefreshCcw } from "react-feather";

export const HistoryIcon = styled(Clock)`
   ${IconMenuStyle};
`;

export const ContentIcon = styled(FileText)`
   ${IconMenuStyle};
`;

export const DeleteIcon = styled(Trash)`
   ${IconMenuStyle};
`;

export const ReOpenIcon = styled(RefreshCcw)`
   ${IconMenuStyle};
`;

export const MigrationSetTableContainer = styled.div<{ numberElementsTab: number }>`
  height: ${( { numberElementsTab } ) => numberElementsTab * 35 + 150}px;
  display: flex;
  flex-direction: column;
`;