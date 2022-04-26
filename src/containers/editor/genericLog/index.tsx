import React from "react";
import { useTabWithId } from "../../../components/editor/tabs/tabContext";
import { toast } from "react-toastify";
import { LogContainer, LogDetailContainer, LogDetailContent} from "./style";
import GenericLogSession from "../../../lib/domain/entities/tabData/genericLogSession";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import {
    FileHeaderContainer,
    FileHeaderLabel,
    FileHeaderSection,
    FileHeaderValue
} from "../../../components/editor/fileHeader/style";


const useStyles = makeStyles(() => createStyles({
    container: {
        height: '100%'
    },
    fileHeader: {
        height: '75px'
    }
}));

interface ViewLogReleaseReportProps {
    tabId: string,
}

const ViewLogReleaseReport = ({ tabId } : ViewLogReleaseReportProps) => {
    const tab = useTabWithId(tabId);
    const { data } = tab;

    if (!(data instanceof GenericLogSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const classes = useStyles();

    const { rowsHeader, logData } = data;

    return (
        <div className={classes.container}>
            <LogContainer>
                <FileHeaderContainer className={classes.fileHeader}>
                    {
                        rowsHeader.map(({ fields}, indexHeader) =>
                            <FileHeaderSection key={`itemSection_${indexHeader}`}>
                                {Object.keys(fields).map((field, indexItem) =>
                                    <div key={`itemHeader_${indexItem}`}>
                                        <FileHeaderLabel>{field}:</FileHeaderLabel>
                                        <FileHeaderValue>{fields[field]}</FileHeaderValue>
                                    </div>
                                )}
                            </FileHeaderSection>
                        )
                    }
                </FileHeaderContainer>
            </LogContainer>

            <LogDetailContainer>
                <LogDetailContent>
                    {logData.map((line, index) => <div key={index}>{line}</div>)}
                </LogDetailContent>
            </LogDetailContainer>
        </div>
    );
}

export default ViewLogReleaseReport;