import React, { MouseEvent } from "react";
import { Button } from "@equisoft/design-elements-react";
import { AutomatedTestHeaderContainer, ButtonActionSection } from "./style";
import { TextEllipsis, CustomCard } from "../../../../components/general";
import { Grid } from "@material-ui/core";

interface AutomatedTestHeaderProps {
    saved: boolean,
    testCasePath: string,
    isEditMode?: boolean,
    isRunning?: boolean,
    runTestSuite?(e: MouseEvent<HTMLButtonElement>) : void,
    saveTestCase?(e: MouseEvent<HTMLButtonElement>) : void,
    abortRunningTask?(e: MouseEvent<HTMLButtonElement>) : void,
}
const AutomatedTestHeader = ( { saved, testCasePath, isEditMode = true, isRunning, runTestSuite, saveTestCase, abortRunningTask } :
                                  AutomatedTestHeaderProps) => {
    const pathDisplay = testCasePath.replace(/@@/g, '/');
    return(
        <AutomatedTestHeaderContainer saved={saved}>
            <CustomCard className='card-container'>
                <Grid container alignItems='center'>
                    <Grid item xs={12} sm={12} md={isEditMode ? 6 : 4}>
                        <div className='card-content-path'>
                            <span>Path:</span>
                            <TextEllipsis title={pathDisplay}>{pathDisplay}</TextEllipsis>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={isEditMode ? 2 : 4}>
                        <div className='card-content-status'>
                            <span>Status:</span>
                            <span>{saved ? 'Saved' : 'Not Saved'}</span>
                        </div>
                    </Grid>
                    {isEditMode &&
					<Grid item xs={12} sm={12} md={4}>
						<ButtonActionSection>
							<div>

                                {isRunning && <Button buttonType="secondary" onClick={abortRunningTask}>Cancel</Button>}

								<Button
									buttonType="secondary"
									onClick={runTestSuite}
									disabled={isRunning}
								>
									Run All
								</Button>

                                <Button buttonType="primary" onClick={saveTestCase}>
                                    Save
                                </Button>
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