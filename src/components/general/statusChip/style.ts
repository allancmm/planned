import styled from "styled-components";
import {blue, green, grey, red} from "@material-ui/core/colors";
import { StatusType} from "./index";

export const StatusContainer = styled.div<{ status: StatusType }>`
    display: flex;
    align-items: center;
    height: 20px;
    width: 90px;
    color: ${({ theme }) => theme.colors.content.active.nav };
    border-radius: var(--spacing-2x);
    padding: 0 6px;
    
    background-color: ${({ status }) => {
    switch ((status).toLocaleLowerCase()) {
        case "success":
            return green[300];
        case "fail":
        case "error":
            return red[300];
        case 'skip':
        case 'warning':
            return '#ffca1c';
        case 'in_progress':
            return blue[300];
        default:
            return grey[300];
    }
}};
    
    > span {
       padding-left: 3px;
    }
`;