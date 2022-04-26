import React from "react";
import {useTabWithId} from "../../../components/editor/tabs/tabContext";
import {toast} from "react-toastify";
import ViewLogReleaseReportSession from "../../../lib/domain/entities/tabData/viewLogReleaseReportSession";
import { CustomCard } from "../../../components/general";
import {Grid} from "@material-ui/core";
import ItemHeader, { ValueContainer } from "../../../components/general/itemHeader";
import { releaseReportStatusToDisplayName } from "../../../lib/domain/enums/releaseReportStatus";
import {LogDetailContainer, LogDetailContent, ViewLogContainer, LogNameFileContainer} from "./style";
import {dateToString, FORMAT_PALETTE} from "../../../lib/util/date";

interface ViewLogReleaseReportProps {
    tabId: string,
}

const ViewLogReleaseReport = ({ tabId } : ViewLogReleaseReportProps) => {
    const tab = useTabWithId(tabId);
    const { data } = tab;

    if (!(data instanceof ViewLogReleaseReportSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const { logReleaseReport: { updatedGMT, updatedBy, action, status, logData, comment, releaseName, logFileName } } = data;

    return (
        <ViewLogContainer>
            <CustomCard>
                <Grid container spacing={2}>
                    <Grid item sm={12}>
                        <Grid container>
                            <Grid item sm={3}>
                                <ItemHeader value={dateToString(updatedGMT, FORMAT_PALETTE)} label='Release Date' />
                            </Grid>
                            <Grid item sm={3}>
                                <ItemHeader value={updatedBy} label='Released By' />
                            </Grid>
                            <Grid item sm={3}>
                                <ItemHeader value={`${action} - (${releaseReportStatusToDisplayName(status)})`} label='Action' />
                            </Grid>
                            <Grid item sm={3}>
                                <ItemHeader value={releaseName} label='Release Name' />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={12}>
                        <ItemHeader value={comment} label='Comment' />
                    </Grid>
                </Grid>
            </CustomCard>
            <>
                <ValueContainer>Log details: <LogNameFileContainer>{logFileName}</LogNameFileContainer></ValueContainer>
                <LogDetailContainer>
                    <LogDetailContent>
                        {logData.split(/\r\n|\r|\n/).map((line, index) => <div key={index}>{line}</div>)}
                    </LogDetailContent>
                </LogDetailContainer>
            </>
        </ViewLogContainer>
    );
}

export default ViewLogReleaseReport;