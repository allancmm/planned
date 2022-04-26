import styled from 'styled-components';
import { Button } from "@equisoft/design-elements-react";
import { FormFieldInline } from "equisoft-design-ui-elements";

export const GitSectionContainer = styled.div`
    p {
        margin-top: 0;

        word-break: break-all;
        white-space: initial;
    }
`;

export const ConfirmElement = styled.div`
   & p {
       color: red;
    }
`;

export const GitStatusContainer = styled.div`
  padding: 6px 12px 16px;
`;

export const GitManagerContainer = styled.div`
   padding: 16px;
`;

export const ProduceButton = styled(Button)`
    max-width: 200px;
`;

export const AdjustedInlineField = styled(FormFieldInline)`
    label {
        font-size: 16px;
    }
`;

export const GitBranchContent = styled.div`
   ul {
     max-height: 200px;
     min-width: auto;
   }
`;
