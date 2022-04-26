import React, { MouseEvent } from "react";
import { Button } from "@equisoft/design-elements-react";
import { Grid } from "@material-ui/core";
import MoreMenu from '../../../../components/editor/fileHeader/actionMenu';
import {AutomatedTestHeaderContainer, ButtonActionSection, MoreMenuContainer} from './style';
import { TextEllipsis, CustomCard } from "../../../../components/general";

interface AutomatedTestHeaderProps {
    tabId: string;
    saved: boolean,
    testSuitePath: string,
    isEditMode?: boolean,
    isRunning?: boolean,
    hasResult?: boolean,
    runTestSuite?(e: MouseEvent<HTMLButtonElement>) : void,
    saveTestSuite?(e: MouseEvent<HTMLButtonElement>) : void,
    abortRunningTask?(e: MouseEvent<HTMLButtonElement>) : void,
    generateReport?(e: MouseEvent<HTMLButtonElement>) : void
}

const AutomatedTestHeader = ( { tabId, saved, testSuitePath, isEditMode = true, isRunning, hasResult, runTestSuite, saveTestSuite, generateReport,
                                  abortRunningTask } : AutomatedTestHeaderProps) => {
    return(
        <AutomatedTestHeaderContainer saved={saved}>
            <CustomCard>
                <Grid container alignItems='center'>
                    <Grid item xs={12} sm={12} md={isEditMode ? 5 : 4}>
                        <div className='card-content-path'>
                            <span>Path:</span>
                            <TextEllipsis title={testSuitePath}>{testSuitePath}</TextEllipsis>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={isEditMode ? 2 : 4}>
                        <div className='card-content-status'>
                            <span>Status:</span>
                            <span>{saved ? 'Saved' : 'Not Saved'}</span>
                        </div>
                    </Grid>
                    {isEditMode &&
                        <Grid item xs={12} sm={12} md={5}>
                            <ButtonActionSection>
                                <div className='actions-container'>
                                    {isRunning &&
                                        <Button buttonType="secondary" label="Cancel" onClick={abortRunningTask} />}
                                    <Button buttonType="secondary" label="Run" onClick={runTestSuite} disabled={isRunning} />
                                    <Button buttonType="secondary" label="Report" onClick={generateReport} disabled={!hasResult} />
                                    <Button buttonType="primary" label="Save" onClick={saveTestSuite} />
                                    <MoreMenuContainer>
                                        <MoreMenu tabId={tabId} />
                                    </MoreMenuContainer>
                                </div>
                            </ButtonActionSection>
                        </Grid>
                    }
                </Grid>
            </CustomCard>
        </AutomatedTestHeaderContainer>
    )};

AutomatedTestHeader.defaultProps = {
    isRunning: false
}
export default AutomatedTestHeader;