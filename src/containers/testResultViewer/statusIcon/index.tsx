import React from "react";
import { AssertionStatus } from "../../../lib/domain/entities/testCase";
import { AlertOctagon, CheckCircle, Slash, XCircle } from "react-feather";
import { StatusIconContainer } from "../style";

interface StatusIconProps {
    status: AssertionStatus
}

const StatusIcon = ({ status } : StatusIconProps) => {
    let statusIcon : JSX.Element;
    let title: string;
    switch (status) {
        case 'FAILURE':
            statusIcon =  <XCircle color='red' />;
            title = 'Fail';
            break;
        case 'SUCCESS':
            statusIcon =  <CheckCircle color='forestgreen'/>;
            title = 'Success';
            break;
        case 'NOT_EXECUTED':
            statusIcon =  <AlertOctagon color='orange'/>;
            title = 'Not executed';
            break;
        case 'COMPILATION_FAILURE':
            statusIcon =  <XCircle color='red' />;
            title = 'Compilation failure';
            break;
        case 'NO_TEST_CASE':
            statusIcon =  <Slash color='blue' />;
            title = 'Test suite without test case';
            break;
    }

    return <StatusIconContainer title={title}>{statusIcon}</StatusIconContainer>;
};

export default StatusIcon;