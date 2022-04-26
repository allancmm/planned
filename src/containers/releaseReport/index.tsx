import React, {RefObject, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import produce from 'immer';
import { WindowContainer, Loading, useLoading } from 'equisoft-design-ui-elements';
import {defaultReleaseReportHistoryService} from '../../lib/context';
import ReleaseReportHistoryService from '../../lib/services/releaseReportHistoryService';
import DataGrid, {getSearchRegex} from "../../components/general/dataGrid";
import {GridCellParams, GridColumns} from "@material-ui/data-grid";
import { IconButton } from "@equisoft/design-elements-react";
import {useTabActions, useTabWithId} from "../../components/editor/tabs/tabContext";
import {toast} from "react-toastify";
import ReleaseReportsData from "../../lib/domain/entities/tabData/releaseReportsData";
import {EDIT_TAB_DATA, OPEN} from "../../components/editor/tabs/tabReducerTypes";
import StatusChip, { StatusType } from "../../components/general/statusChip";
import { releaseReportStatusToDisplayName } from "../../lib/domain/enums/releaseReportStatus";
import { dateToString, FORMAT_PALETTE } from "../../lib/util/date";
import PopOverMenu, {ItemPopOverMenu} from "../../components/general/popOverMenu";
import ViewManifestSession from "../../lib/domain/entities/tabData/viewManifestSession";
import { TextEllipsis } from "../../components/general";
import ViewLogReleaseReportSession from "../../lib/domain/entities/tabData/viewLogReleaseReportSession";
import {compareDesc} from "date-fns";
import LogHistoryRelease from "../../lib/domain/entities/logHistoryRelease";

interface ReleasesReportProps {
    tabId: string;
    releaseReportHistoryService: ReleaseReportHistoryService;
}

const ReleasesReport = ({ tabId, releaseReportHistoryService }: ReleasesReportProps) => {
    const tab = useTabWithId(tabId);
    const { data } = tab;

    if (!(data instanceof ReleaseReportsData)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const dispatch = useTabActions();

    const [loading, load] = useLoading();

    const dispatchUpdate = (newData: ReleaseReportsData) => {
        dispatch({ type: EDIT_TAB_DATA,
            payload: { tabId, data: newData }});
    };

    const { logHistories, searchText, logHistoryChosen } = data;

    const [rows, setRows] = useState<LogHistoryRelease[]>([]);

    const [openMainAction, setOpenMainAction] = useState(false);

    const anchorRefMain = useRef<HTMLDivElement>(null);

    const [anchorMenu, setAnchorMenu] = useState<RefObject<HTMLDivElement>>(anchorRefMain);

    useEffect(() => setRows([
        ...logHistories.sort((a, b) => compareDesc(a.updatedGMT, b.updatedGMT) )])
        , [logHistories]);

    useEffect(() => {
        if(logHistories.length === 0) {
            init();
        } else {
            requestSearch(searchText);
        }
    }, []);

    const init = async () => {
        const result = await load(releaseReportHistoryService.getLogHistoryList)();
        dispatchUpdate(produce(data, (draft) => {
            draft.logHistories = result;
        }));
    };

    const requestSearch = (value: string) => {
        dispatchUpdate(produce(data, (draft) => {
            draft.searchText = value;
        }));
        const searchRegex = getSearchRegex(value);
        const filteredRows = logHistories.filter((row: LogHistoryRelease) =>
            Object.keys(row).some((field) => {
                const keyLog = field as keyof Omit<LogHistoryRelease, '[unknown]'>;
                switch (keyLog) {
                    case 'updatedGMT':
                        return searchRegex.test(dateToString(row.updatedGMT, FORMAT_PALETTE));
                    case 'status':
                        return searchRegex.test(releaseReportStatusToDisplayName(row.status));
                    case "remoteRepositoryUrl":
                    case "logHistoryGuid":
                    case "commitId":
                    case "logFileName":
                    case "releaseGuid":
                    case "logData":
                    case "manifestData":
                        return null;
                    default: return searchRegex.test(row[keyLog] as string);
                }
            })
        );
        setRows(filteredRows);
    }

    const viewManifest = useCallback(() => {
        const manifestJSON = JSON.parse(logHistoryChosen.manifestData);
        dispatch({ type: OPEN, payload: { data:  new ViewManifestSession(manifestJSON) } });
    }, [logHistoryChosen]);

    const viewLog = useCallback(() => {
        dispatch({ type: OPEN, payload: { data: new ViewLogReleaseReportSession( logHistoryChosen) }});
    }, [logHistoryChosen]);

    const itemsMenuAction = useMemo(() : ItemPopOverMenu[] => ([
        { label: `View Manifest ${!logHistoryChosen.manifestData ? '(Not available)' : ''}`,
          value: 'viewManifest',
          onClick: viewManifest,
          disabled: !logHistoryChosen.manifestData
        },
        { label: `View Details ${!logHistoryChosen.logData ? '(Not available)' : '' }`,
          value: 'viewDetails',
          onClick: viewLog,
          disabled: !logHistoryChosen.logData
        },
    ]), [logHistoryChosen, viewManifest, viewLog]);

    const handleCloseMainAction = () => {
        setOpenMainAction(false);
    }

    const columns: GridColumns = [
        { headerName: 'Release Date',
          field: 'updatedGMT',
          flex: 1,
          renderCell: ({ row }) => <>{dateToString(row.updatedGMT, FORMAT_PALETTE)}</>
        },
        { headerName: 'Released By', field: 'updatedBy', flex: 1 },
        { headerName: 'Action', field: 'action', flex: 0.75 },
        { headerName: 'Release Template',
          field: 'releaseTemplate',
          flex: 1,
          renderCell: ({ row } : GridCellParams) => <TextEllipsis title={row.releaseTemplate}>{row.releaseTemplate}</TextEllipsis>
        },

        { headerName: 'Status',
          field: 'status',
          flex: 0.5,
          renderCell: ({ row } : GridCellParams) =>
              <StatusChip status={ (releaseReportStatusToDisplayName(row.status) as StatusType) }/>
        },

        { field: '',
          headerName: '',
          description: '',
          hideSortIcons: true,
          sortable: false,
          align: 'right',
          flex: 0.25,
          renderCell: ({ row }) => {
              const refRow = useRef<HTMLDivElement>(null);
              return <IconButton
                          ref={refRow}
                          iconName='moreVertical'
                          buttonType="tertiary"
                          onClick={() => {
                              setAnchorMenu(refRow);
                              setOpenMainAction(prev => !prev);
                              dispatchUpdate(produce(data, (draft) => {
                                  draft.logHistoryChosen = row as LogHistoryRelease;
                              }));
                          }}
                      />
          }
        }
    ];

    return (
        <WindowContainer>
            <Loading loading={loading} />
            <DataGrid
                  id='logHistoryGuid'
                  columns={columns}
                  rows={rows}
                  disableColumnMenu
                  searchText={searchText}
                  requestSearch={requestSearch}
                  isShowInputFilter
                  pageSize={10}
                  rowCount={rows.length}
            />
            <PopOverMenu
                openAction={openMainAction}
                setOpenAction={setOpenMainAction}
                anchorRef={anchorMenu}
                itemsMenu={itemsMenuAction}
                handleClose={handleCloseMainAction}
            />
        </WindowContainer>
    );
};

ReleasesReport.defaultProps = {
    releaseReportHistoryService: defaultReleaseReportHistoryService,
};

export default ReleasesReport;
