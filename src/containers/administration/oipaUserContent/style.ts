import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ButtonContent = styled.div<{isEdit?: boolean}>`
   > button {
        color: ${({ isEdit = false }) => (isEdit ? '#006296' : '#CD2C23')}
   }
`;

export const ActionIcon = styled(FontAwesomeIcon)`
   cursor: pointer,   
`;