import styled from "styled-components";
import { Box } from "@material-ui/core"
export const DataGridWrapper = styled.div`
   height: 100%;
   .sc-eCApnc {
      height: 100%;
   }
   
   .sc-iCoGMd {
      height: calc(100% - 30px);
   }
`;

export const DataGridContainer = styled(Box)`
   height: 100%;
   width: 100%;
`;

export const TitleContainer = styled.div`
   height: var(--spacing-4x);
   font-size: 1.5rem;
`;

export const DataGridContent = styled.div<{ height?: number }>`
   height: ${({ height }) => height ?? 400 }px
`;