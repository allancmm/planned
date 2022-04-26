import React, { useMemo, useState } from 'react';
import { CollapseContainer, CollapseHeaderProps, Caret } from 'equisoft-design-ui-elements';
import { Grid } from "@material-ui/core";
import { Heading } from "@equisoft/design-elements-react";
import { toast } from 'react-toastify';
import { useTabWithId } from '../../components/editor/tabs/tabContext';
import TestReport from '../../lib/domain/entities/tabData/testReport';
import { AssertionStatus } from '../../lib/domain/entities/testCase';
import TestResult, {AssessmentResult} from '../../lib/domain/entities/testResult';
import HeaderTestResultViewer from "./headerTestResultViewer";
import { v4 as uuid } from "uuid";
import {
    AssessmentContainer,
    StatusContainer,
    TestResultViewerContainer,
    HeaderContainer, TestSuiteContainer, TestSuiteStatusContainer, SummaryReport, DetailsStatus, StatusDetail
} from "./style";
import StatusIcon from "./statusIcon";
import {dateToString, FORMAT_DATE_TIME} from "../../lib/util/date";

const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';
const NOT_EXECUTED = 'NOT_EXECUTED';

const StatusReportList = [SUCCESS, FAILURE, NOT_EXECUTED] as const;
type StatusReport = typeof StatusReportList[number];

const buildListTestCase = (list: TestResult[], sub: TestResult, parentSub: TestResult, name: string) => {
    const t = list.find(i => i.name === name);
    if(t){
        t.subTests.push(sub);
    } else {
        list.push(parentSub);
    }
}

const TestResultViewer = ({ tabId }: { tabId: string }) => {
    const tab = useTabWithId(tabId);
    const { data } = tab;
    if (!(data instanceof TestReport)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const { report, runBy, runDate } = data;

    let countTestSuite = 0;
    let countTestCases = 0;
    let countPassed = 0;
    let countFailed = 0;
    let countNotExecuted = 0;

    const listPassed: TestResult[] = [];
    const listFailure: TestResult[] = [];
    const listNotExecuted: TestResult[] = [];

    const counter = (parent: TestResult, sub: TestResult) => {
        if(sub.type === 'ASSESSMENT') {
            return;
        }
        if(sub.type === 'TEST_SUITE') {
            countTestSuite++;
        } else {
            if(sub.type === 'TEST_CASE') {
                countTestCases++;
                const parentSub = {...parent, id: uuid() , subTests: [sub]};

                switch (sub.result.status) {
                    case 'SUCCESS':
                        countPassed++;
                        buildListTestCase(listPassed, sub, parentSub, parent.name);
                        break;
                    case 'FAILURE':
                    case "COMPILATION_FAILURE":
                        countFailed++;
                        buildListTestCase(listFailure, sub, parentSub, parent.name);
                        break;
                    case 'NOT_EXECUTED':
                        countNotExecuted++;
                        buildListTestCase(listNotExecuted, sub, parentSub, parent.name);
                        break;
                }
            }
        }


        sub.subTests.forEach(s => {
            counter(sub, s);
        });
    }

    const paramsTestSuiteStatus = useMemo(() => {
        if(report.type === 'TEST_SUITE') {
            countTestSuite++;
        }
        report.subTests.forEach((subTest) => {
            counter(report, subTest);
        });

        return {
            totalTestSuite: countTestSuite,
            totalTestCase: countTestCases,
            'SUCCESS': {
                label: 'passed',
                color: 'forestgreen',
                items: listPassed,
                size:  countPassed
            },
            'FAILURE': {
                label: 'failed',
                color: 'red',
                items: listFailure,
                size: countFailed
            },
            'NOT_EXECUTED': {
                label: 'not executed',
                color: 'orange',
                items: listNotExecuted,
                size: countNotExecuted
            },
        }
    }, [report]);

    const StatusHeader = (status: StatusReport) => ({ title, children, onClick }: CollapseHeaderProps) => {
        return (
            <TestSuiteStatusContainer color={paramsTestSuiteStatus[status].color} onClick={onClick}>
                <div className='suite-status'>
                    {title}

                    {`${paramsTestSuiteStatus[status].label}: ${paramsTestSuiteStatus[status].size}`}

                    {children}
                </div>
            </TestSuiteStatusContainer>
        );
    }

    const TestSuiteStatus = useMemo(() => ({ status } : { status: StatusReport }) => {
        const [isOpen, setOpen] = useState(false);
        return (
            <CollapseContainer
                title='Test case '
                open={isOpen}
                toggleOpen={() => setOpen((prev) => !prev)}
                header={StatusHeader(status)}
                key={status}
            >
                <TestSuiteContainer>
                    {paramsTestSuiteStatus[status].items.map((r: TestResult) => (
                        <TestSuiteSection parentStatus={status} report={r} key={r.id} />
                    ))}
                </TestSuiteContainer>
            </CollapseContainer>
        );
    } , [report.subTests, paramsTestSuiteStatus]);

    return (
        <TestResultViewerContainer>

            <HeaderTestResultViewer
                name={report.name}
                executionTime={report.executionTime}
                success={paramsTestSuiteStatus[SUCCESS].size}
                skipped={paramsTestSuiteStatus[NOT_EXECUTED].size}
                failures={paramsTestSuiteStatus[FAILURE].size}
            />

            <Grid container className='detail-status' spacing={1}>
                <Grid item sm={3}>
                    <SummaryReport>
                        <Heading type="large" bold>Summary</Heading>

                        <Heading type="small" bold>
                            Run by: {runBy}
                        </Heading>

                        <Heading type="small" bold>
                            Run date: {dateToString(runDate, FORMAT_DATE_TIME)}
                        </Heading>

                        <Heading type="small" bold className='summary-total-case'>
                            Total test cases: {paramsTestSuiteStatus.totalTestCase}
                        </Heading>

                        <div className='summary-status-details'>
                            <StatusDetail color={paramsTestSuiteStatus[SUCCESS].color}>
                                Passed: {paramsTestSuiteStatus[SUCCESS].size}
                            </StatusDetail>
                            <StatusDetail color={paramsTestSuiteStatus[FAILURE].color}>
                                Failed: {paramsTestSuiteStatus[FAILURE].size}
                            </StatusDetail>
                            <StatusDetail color={paramsTestSuiteStatus[NOT_EXECUTED].color}>
                                Not executed: {paramsTestSuiteStatus[NOT_EXECUTED].size}
                            </StatusDetail>
                        </div>
                    </SummaryReport>
                </Grid>
                <Grid item sm={9}>
                    <DetailsStatus>
                        {StatusReportList.map((status) => (
                            <TestSuiteStatus key={status} status={status} />
                        ))}
                    </DetailsStatus>
                </Grid>
            </Grid>

        </TestResultViewerContainer>
    );
};

const TestSuiteSection = ({ parentStatus, report }: { parentStatus: AssertionStatus, report: TestResult }) => {
    if (report.type === 'ASSESSMENT') {
        return <Assessment label={report.name} result={report.result} key={report.id} />;
    }

    const [isOpen, setOpen] = useState(false);

    return (
        <CollapseContainer
            title={report.name}
            open={isOpen}
            toggleOpen={() => setOpen((prev) => !prev)}
            header={TestsSuiteHeader(parentStatus, report, isOpen)}
            key={report.id}
        >
            <TestSuiteContainer>
                { report.type === 'TEST_CASE' && report.result.status === NOT_EXECUTED ?
                    <div className='details-container'>{report.result.details}</div> :
                    report.subTests.map((r) => (
                        <TestSuiteSection parentStatus={report.result.status} report={r} key={r.id} />
                    ))
                }
            </TestSuiteContainer>
        </CollapseContainer>
    );
};

const Assessment = ({ label, result }: { label: string; result: AssessmentResult }) => {
    const { status, details, actual, expected } = result;
    return (
        <AssessmentContainer>
            <StatusContainer>
                <StatusIcon status={status} />
                <b className='icon-label'>Assessment: {label}</b>
            </StatusContainer>
            {status !== SUCCESS && status !== NOT_EXECUTED && (
                <div className='detail'>
                    <span>{details}</span>
                    {status === FAILURE && (
                        <>
                            <div><b>Expected:</b> {JSON.stringify(expected)}</div>
                            <div><b>Actual:</b> {JSON.stringify(actual)}</div>
                        </>
                    )}
                </div>
            )}
        </AssessmentContainer>
    );
};

const TestsSuiteHeader = (parentStatus: AssertionStatus, report: TestResult, isOpen: boolean) => ({ title, children, onClick }: CollapseHeaderProps) => {
    const hasChildren = report.subTests.length > 0 || (report.result.status === NOT_EXECUTED && !!report.result.details);

    switch (report.type) {
        case 'TEST_SUITES':
        case 'TEST_SUITE':
        case 'TEST_CASE':
        case 'ASSESSMENT':
            return (
                <HeaderContainer onClick={onClick} hasChildren={hasChildren}>
                    <div className='content'>
                        <div className='icon-expand'>
                            {hasChildren && <Caret isExpand={isOpen}/>}
                        </div>
                        {report.packageName ?
                            <b>Test Suite: {title}
                               {parentStatus === SUCCESS && ` [Covered lines ${report.coverageResult?.produceString() ?? 'N/A'}]`}
                            </b>
                            :
                            <>
                                <div className='icon-status'>
                                    <StatusIcon status={report.result.status} />
                                </div>
                                <b>Test Case: {title}</b>
                            </>
                        }
                        {report.result.status !== NOT_EXECUTED && children}
                    </div>
                </HeaderContainer>
            );
    }
};

export default TestResultViewer;
