import React from 'react';
import AutomatedTestResult from '../../../../lib/domain/entities/automatedTestItems/automatedTestResult';
import {ResultContainer, ResultRow, TaskFailure, TaskStatus, TaskType} from './style';

const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const NOT_EXECUTED = 'NOT_EXECUTED';
const TEST_SUITE = 'TestSuite';
const TEST_CASE = 'TestCase';
const STEP = 'Step';

const paramsTestSuiteStatus: any = {
    'SUCCESS': {
        label: 'passed',
        color: 'forestgreen'
    },
    'FAILURE': {
        label: 'failed',
        color: 'red'
    },
    'NOT_EXECUTED': {
        label: 'not executed',
        color: 'orange'
    }
};

interface AutomatedTestResultOutputProps {
    result: AutomatedTestResult;
}

const AutomatedTestResultOutput = ({ result }: AutomatedTestResultOutputProps) => {
    const taskType = (type: string) => {
        switch(type) {
            case TEST_SUITE:
                return (<TaskType margin={'0px'}>{type}</TaskType>);
            case TEST_CASE:
                return (<TaskType margin={'20px'}>{type}</TaskType>);
            case STEP:
                return (<TaskType margin={'40px'}>{type}</TaskType>);
            default:
                return undefined;
        }
    }

    const taskStatus = (status: string) => {
        switch(status) {
            case 'SUCCESS':
                return (<TaskStatus color={paramsTestSuiteStatus[SUCCESS].color}>{paramsTestSuiteStatus[SUCCESS].label}</TaskStatus>);
            case 'FAIL':
                return (<TaskStatus color={paramsTestSuiteStatus[FAILURE].color}>{paramsTestSuiteStatus[FAILURE].label}</TaskStatus>);
            case 'SKIP':
                return (<TaskStatus color={paramsTestSuiteStatus[NOT_EXECUTED].color}>{paramsTestSuiteStatus[NOT_EXECUTED].label}</TaskStatus>);
            default:
                return undefined;
        }
    }

    return (
        <ResultContainer>
            {result.isRunning() ?? <>Running...</>}
            {result.isFinished() && result.tasks.map((task) => (
                <ResultRow key={task.name}>
                    {taskType(task.type)}
                    <div>{task.name}</div>
                    {taskStatus(task.status)}
                    {task.failureReason && <TaskFailure color={paramsTestSuiteStatus[FAILURE].color}>{task.failureReason}</TaskFailure>}
                </ResultRow>
            ))}
        </ResultContainer>
    );
}

export default AutomatedTestResultOutput;