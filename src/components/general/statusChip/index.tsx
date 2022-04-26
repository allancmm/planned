import React from "react";
import { Icon } from "@equisoft/design-elements-react";
import { SkipForward, Clock } from "react-feather";
import { StatusContainer } from "./style";

export type StatusType = 'SUCCESS' | 'FAIL' | 'ERROR' | 'SKIP' | 'WARNING' | 'IN_PROGRESS' | '';

const getIcon = (status: string) => {
    switch (status.toLocaleLowerCase()) {
        case 'success':
            return <Icon name='check' size={16} />;
        case 'fail':
        case 'error':
            return <Icon name='alertTriangle' size={16} />;
        case 'skip':
            return <SkipForward size={16} />;
        case 'in_progress':
            return <Clock size={16} />
        default:
            return <Icon name='helpCircle' size={16} />
    }
}

interface StatusChipProps {
    status: StatusType,
}

// TODO - Allan - make this component more generic
const StatusChip = ({ status } : StatusChipProps) =>
        <StatusContainer status={status}>
            {getIcon(status)}
            <span>{status === 'IN_PROGRESS' ? 'RUNNING' : status}</span>
        </StatusContainer>

export default StatusChip;