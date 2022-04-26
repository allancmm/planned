import React, {useMemo} from "react";
import { useTabWithId } from "../../../components/editor/tabs/tabContext";
import { toast } from "react-toastify";
import ViewManifestSession from "../../../lib/domain/entities/tabData/viewManifestSession";
import { Grid } from "@material-ui/core";
import { ReleaseTypeCodeEnum } from "../../../lib/domain/enums/releaseType";
import DataGrid from "../../../components/general/dataGrid";
import { GridColumns } from "@material-ui/data-grid";
import { ViewManifestContainer, HistoryContainer, ButtonSection } from "./style";
import { Button } from "@equisoft/design-elements-react";
import { convertJsonToBlob, downloadFile } from "../../../lib/util/miscellaneous";
import { CustomCard } from "../../../components/general";
import ItemHeader, { ValueContainer } from "../../../components/general/itemHeader";

const columnsTables: GridColumns = [
    { field: 'code', headerName: 'Tables', flex: 1 }
];

const columnsContent: GridColumns = [
    { field: 'code', headerName: 'Content', flex: 1 }
];

const columnsHistory: GridColumns = [
    { field: 'environment', headerName: 'Environment', flex: 1 },
    { field: 'modifiedBy', headerName: 'Modified By', flex: 1 },
    { field: 'modifiedGMT', headerName: 'Modified Date', flex: 1 },
    { field: 'statusCode', headerName: 'Status', flex: 1 }
];

const MAX_ROWS = 5;

interface ViewManifestProps {
   tabId: string
}
const ViewManifest = ({ tabId } : ViewManifestProps) => {
    const tab = useTabWithId(tabId);
    const { data } = tab;

    if (!(data instanceof ViewManifestSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }
    const { manifest } = data;

    const tables = useMemo(() => manifest.releaseTemplate.tables.map((t) => ({ code: t, value: t }))
        ,[manifest.releaseTemplate.tables]);

    const content = useMemo(() => manifest.content.map((t) => ({ code: t, value: t })), [manifest.content]);

    const heightMiddleTables = useMemo(() => Math.max(tables.length > 0 ? 320 : 180, content.length > 0 ? 320 : 180 ), [tables.length, content.length ]);

    const downloadJSON = () => {
        const blob = convertJsonToBlob(manifest);
        downloadFile(manifest.releaseName, blob, 'json');
    }

    return (
        <ViewManifestContainer>
            <CustomCard>
                <Grid container>
                    <Grid container>
                        <Grid item sm={3}>
                            <ItemHeader value={manifest.releaseName} label='Name' />
                        </Grid>

                        <Grid item sm={3}>
                            <ItemHeader value={manifest.releaseDescription} label='Description' />
                        </Grid>

                        <Grid item sm={3}>
                            <ItemHeader value={manifest.designVersion} label='Design version' />
                        </Grid>

                        <Grid item sm={3}>
                            <ItemHeader value={manifest.oipaVersion} label='OIPA version' />
                        </Grid>
                    </Grid>

                    <Grid container className='secondary-details'>
                        <Grid item sm={3}>
                            <ItemHeader value={`${manifest.buildBy} - ${manifest.buildDate.substring(0, 10)}`} label='Build' />
                        </Grid>

                        <Grid item sm={3}>
                            <ItemHeader value={manifest.sourceEnvironment} label='Environment' />
                        </Grid>
                        <Grid item sm={3}>
                            <ItemHeader value={ReleaseTypeCodeEnum.getEnumFromCode(manifest.releaseType).value} label='Release type' />
                        </Grid>
                        <Grid item sm={3}>
                            <ButtonSection title='Download as JSON'>
                                <Button
                                    buttonType='primary'
                                    onClick={ downloadJSON }
                                >
                                    Download as JSON
                                </Button>
                            </ButtonSection>
                        </Grid>
                    </Grid>
                </Grid>
            </CustomCard>


            <Grid container spacing={2}>
                <Grid item sm={6}>
                    <CustomCard height={heightMiddleTables}>
                        <DataGrid
                          id='code'
                          pageSize={MAX_ROWS}
                          rows={tables}
                          columns={columnsTables}
                          showMenuIcon
                        />
                    </CustomCard>
                </Grid>

                <Grid item sm={6}>
                    <CustomCard height={heightMiddleTables}>
                        <DataGrid
                            id='code'
                            pageSize={MAX_ROWS}
                            rows={content}
                            columns={columnsContent}
                            showMenuIcon
                        />
                    </CustomCard>
                </Grid>
            </Grid>

            <CustomCard height={manifest.history.length > MAX_ROWS ? 380 : manifest.history.length * 35 + 200}>
                <HistoryContainer>
                    <ValueContainer>History</ValueContainer>
                    <DataGrid
                        id='environment'
                        pageSize={MAX_ROWS}
                        rows={manifest.history}
                        columns={columnsHistory}
                        showMenuIcon
                    />
                </HistoryContainer>
            </CustomCard>
        </ViewManifestContainer>
    );
}

export default ViewManifest;