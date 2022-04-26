import React from "react";
import { CustomCard } from "../../../components/general";
import { Grid } from '@material-ui/core';
import { TestResultHeaderContainer } from "./style";
import StatusIcon from "../statusIcon";

interface HeaderTestResultViewerProps {
    name: string,
    executionTime: number,
    success: number,
    skipped: number,
    failures: number,
}
const HeaderTestResultViewer = ({ name, executionTime, failures, success, skipped } : HeaderTestResultViewerProps) => {
    return (
        <TestResultHeaderContainer>
            <CustomCard className="container">
                <div className='content'>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <div className='test-suit-name'>
                                <span>Test Suite:</span>
                                <span title={name}>{name}</span>
                            </div>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <div className='execution-time'>
                                <span>Execution Time:</span>
                                <span>{`${executionTime} ms`}</span>
                            </div>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <div className='results'>
                                <span>Test Case Results:</span>
                                <div className='result-content'>
                                    <div className='result-item'>
                                        <StatusIcon status='SUCCESS' />
                                        <span>{success}</span>
                                    </div>
                                    <div className='result-item'>
                                        <StatusIcon status='FAILURE' />
                                        <span>{failures}</span>
                                    </div>
                                    <div className='result-item'>
                                        <StatusIcon status='NOT_EXECUTED' />
                                        <span>{skipped}</span>
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </CustomCard>
        </TestResultHeaderContainer>
    );
};

export default HeaderTestResultViewer;