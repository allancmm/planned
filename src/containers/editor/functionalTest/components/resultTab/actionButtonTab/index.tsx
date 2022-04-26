import React from "react";
import {Button} from "@equisoft/design-elements-react";
import { ArrowDown, ArrowUp } from "react-feather";

interface ActionButtonTapProps {
    label: string,
    isExpanded: boolean,
    className?: string,
    onClick() : void
};

// Button wrapped to avoid warning msg's from Material UI when injecting props from Tab to Button
const ActionButtonTab = ({ className = '', onClick, label, isExpanded } : ActionButtonTapProps ) =>
    <Button className={className} buttonType='tertiary' onClick={onClick}>
        <span>{label}</span>
        {isExpanded ? <ArrowDown size={16}/> : <ArrowUp size={16} />}
    </Button>

export default ActionButtonTab;