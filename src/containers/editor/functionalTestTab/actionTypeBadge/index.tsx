import React from "react";
import { MathActionBadge, AssessmentFileBadge, BasicActionBadge, AssessmentSqlBadge, ActionSoapBadge } from "./style";

interface ActionTypeBadgeProps {
    type: string;
}
const ActionTypeBadge = ({ type } : ActionTypeBadgeProps) : JSX.Element => {
    switch (type) {
        case 'Math':
            return <MathActionBadge title='Math' />;
        case 'AssessmentFileCompare':
            return <AssessmentFileBadge title='AssessmentFileCompare' />;
        case 'AssessmentSql':
            return <AssessmentSqlBadge title='AssessmentSql' />;
        case 'ActionSoap':
            return <ActionSoapBadge title='ActionSoap' />;
        default:
            return <BasicActionBadge />;
    }
}

ActionTypeBadge.defaultProps = {
    type: '',
};

export default ActionTypeBadge;