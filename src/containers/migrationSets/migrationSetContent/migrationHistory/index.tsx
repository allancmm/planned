import React, {RefObject, useCallback, useMemo, useRef, useState} from 'react';
import {defaultMigrationSetService, defaultReportsService} from '../../../../lib/context';
import MigrationSet from '../../../../lib/domain/entities/migrationSet';
import {MigrationSetStatusEnum} from '../../../../lib/domain/enums/migrationSetStatus';
import {MigrationSetTableContainer} from "../style";
import {GridCellParams, GridColumns} from "@material-ui/data-grid";
import {dateToString} from "../../../../lib/util/date";
import DataGrid, {TitleDataGrid} from "../../../../components/general/dataGrid";
import PopOverMenu, {ItemPopOverMenu} from "../../../../components/general/popOverMenu";
import {MigrationHistory} from "../../../../lib/domain/entities/migrationHistory";
import {IconButton} from "@equisoft/design-elements-react";
import {useTabActions} from "../../../../components/editor/tabs/tabContext";
import {OPEN} from "../../../../components/editor/tabs/tabReducerTypes";
import GenericLogSession, { RowHeaderGenericLog } from "../../../../lib/domain/entities/tabData/genericLogSession";

interface MigrationHistoriesInSetProps {
    migrationSet: MigrationSet;
}

const MigrationHistoriesInSet = ({ migrationSet }: MigrationHistoriesInSetProps) => {
    const dispatch = useTabActions();

    const { migrationHistory, migrationSetName,  lastModifiedBy } = migrationSet;

    const [migrationChosen, setMigrationChosen] = useState<MigrationHistory>();
    const anchorRefMain = useRef<HTMLDivElement>(null);

    const [anchorMenu, setAnchorMenu] = useState<RefObject<HTMLDivElement>>(anchorRefMain);
    const [openMainAction, setOpenMainAction] = useState(false);

    const handleViewLogClick = useCallback(() => {
        if(migrationChosen) {
            const rowsHeader: RowHeaderGenericLog[] = [{
                fields: {
                    'Type': 'Migration Set',
                    'Name': migrationSetName,
                    'Guid': migrationSet.migrationSetGuid,
                    'Owner': lastModifiedBy,
                },
            }, {
                fields: {
                    Status: MigrationSetStatusEnum.getEnumFromCode(migrationChosen.status).value,
                }
            }];
            const logData = migrationChosen.logData.split(/\r\n|\r|\n/);
            const genericLogSession =
                new GenericLogSession(migrationChosen.migrationHistoryGuid,
                             `Log - ${dateToString(migrationChosen.migrationDate, 'MM/dd/yyyy HH:mm:ss')}`,
                                      rowsHeader,
                                      logData);
            dispatch({ type: OPEN, payload: { data: genericLogSession }});
        }
    }, [migrationChosen]);

    const itemsMenuAction = useMemo((): ItemPopOverMenu[] => ([
        { label: `View Log ${migrationChosen?.logData ? '' : '(Not available)'}`,
          value: 'viewLog',
          onClick: handleViewLogClick,
          disabled: !migrationChosen?.logData
        }
    ]), [migrationChosen, migrationChosen]);

    const handleCloseMainAction = () => {
        setOpenMainAction(false);
    }

    const columns: GridColumns = [
        {
            headerName: 'Time of Migration',
            renderCell: ({ row }: GridCellParams) => <>{dateToString(row.migrationDate, 'MM/dd/yyyy HH:mm:ss')}</>,
            field: 'migrationDate',
            flex: 1,
        },
        {
            headerName: 'Source Environment',
            field: 'source',
            flex: 1,
        },
        {
            headerName: 'Destination Environment',
            field: 'destination',
            flex: 1,
        },
        {
            headerName: 'Status',
            field: 'status',
            flex: 1,
            renderCell: ({ row }: GridCellParams) => {
                const statusCode = MigrationSetStatusEnum.getEnumFromCode(row.status);
                return statusCode ? <>{statusCode.value}</> : <>Undefined Status</>;
            },
        },
        {
            headerName: 'Included in Release',
            field: 'attachedRelease',
            flex: 1,
        },
        { field: '',
          headerName: '',
          sortable: false,
          hideSortIcons: true,
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
                           setMigrationChosen(row as MigrationHistory);
                    }}
                />
            }
        }
    ];
    return (
        <MigrationSetTableContainer numberElementsTab={migrationHistory.length}>
            <TitleDataGrid value='Migration History' />
            <DataGrid
                id='migrationHistoryGuid'
                columns={columns}
                rows={migrationHistory}
                rowCount={migrationHistory.length}
                disableColumnMenu
            />

            <PopOverMenu
                openAction={openMainAction}
                setOpenAction={setOpenMainAction}
                anchorRef={anchorMenu}
                itemsMenu={itemsMenuAction}
                handleClose={handleCloseMainAction}
            />
        </MigrationSetTableContainer>
    );
};

MigrationHistoriesInSet.defaultProps = {
    migrationSetService: defaultMigrationSetService,
    reportService: defaultReportsService
};

export default MigrationHistoriesInSet;

