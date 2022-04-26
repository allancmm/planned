import React, {useContext, useEffect, useRef} from 'react';
import { useLoading, Loading, WindowContainer } from "equisoft-design-ui-elements";
import { toast } from 'react-toastify';
import {
    TabContainer,
    PopOverMenu, ButtonAction, ItemPopOverMenu
} from "../../../components/general";
import {
    FileHeaderContainer,
    FileHeaderSection,
    FileHeaderLabel,
    FileHeaderValue,
    Actions
} from "../../../components/editor/fileHeader/style";
import { useModal } from "@equisoft/design-elements-react";
import { useTabActions, useTabWithId } from '../../../components/editor/tabs/tabContext';
import {SidebarContext} from '../../../components/general/sidebar/sidebarContext';
import { defaultMigrationSetService, defaultReportsService } from '../../../lib/context';
import MigrationSetSession from '../../../lib/domain/entities/tabData/migrationSetSession';
import MigrationSetService from '../../../lib/services/migrationSetService';
import ReportService from '../../../lib/services/reportService';
import MigrationSetContent from './migrationSetContent';
import produce, { Draft } from "immer";
import { EDIT_TAB_DATA } from "../../../components/editor/tabs/tabReducerTypes";
import { HistoryIcon, ContentIcon, ReOpenIcon } from "./style";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import ModalEditMigrationSet, {FieldMigrationSetEditType} from "./modalEditMigrationSet";
import { MigrationSetStatusEnum } from "../../../lib/domain/enums/migrationSetStatus";

const useStyles = makeStyles(createStyles({
    migrationSetContainer: {
        padding: 'var(--spacing-1x)'
    }
}));

interface MigrationSetContentTabProps {
    tabId: string;
    layoutId: number;
    migrationSetService: MigrationSetService;
    reportService: ReportService
}

const MigrationSetContentTab = ({ tabId, migrationSetService, reportService }: MigrationSetContentTabProps) => {
    const tab = useTabWithId(tabId);
    const { data } = tab;

    if (!(data instanceof MigrationSetSession)) {
        toast(`Tab ${tab.name} has invalid data`);
        return null;
    }

    const {
        isModalOpen,
        closeModal,
    } = useModal();

    const classes = useStyles();
    const [loading, load] = useLoading();
    const {toggleRefreshSidebar} = useContext(SidebarContext);
    const dispatch = useTabActions();
    const anchorRef = useRef<HTMLDivElement>(null);

    const {set, openActionButton, migrationSetEdit } = data;

    useEffect(() =>
         () => {
            updateSession((draft => {
                draft.openActionButton = false;
            }))
    }, []);


    const updateSession = (recipe : (draft: Draft<MigrationSetSession>) => void) => {
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, recipe)
            }
        })
    };

    const setOpenActionMenu = (isOpen: boolean) => {
        updateSession((draft) => {
            draft.openActionButton = isOpen;
        });
    };

    const openContentReport = async () => {
        handleCloseMenuAction();
        const input = await load(reportService.getMigrationSetContentReport)(set.migrationSetGuid);
        const display = " <div><pre>" + JSON.stringify(input, null, 2) + "</pre></div>"
        const newTab = window.open('about:blank', '_blank');
        newTab?.document.write(display);
        newTab?.document.close();
    };

    const openMigrationReport = async () => {
        handleCloseMenuAction();
        const input = await load(migrationSetService.getSetHistory)(set.migrationSetGuid)
        const display = " <div><pre>" + JSON.stringify(input, null, 2) + "</pre></div>"
        const newTab = window.open('about:blank', '_blank');
        newTab?.document.write(display);
        newTab?.document.close();
    };

    const handleClickReopen = load(async () => {
        const status = await migrationSetService.reopenMigrationSet(data.set.migrationSetGuid);
        updateSession(draft => { draft.set.status = status });
        toggleRefreshSidebar();
        toast('Migration set has been reopened');
    });

    const itemsMenu: ItemPopOverMenu[] = [
        { label: 'Reopen', value: 'reopen', onClick: handleClickReopen, disabled: data.set.isReadyToMigrate(), startIcon: <ReOpenIcon /> },
        { label: 'Content', value: 'content', onClick: openContentReport, startIcon: <ContentIcon /> },
        { label: 'Migration History', value: 'migrationHistory', onClick: openMigrationReport, startIcon: <HistoryIcon /> }
    ]

    const handleCloseMenuAction = () => {
        setOpenActionMenu(false);
    }

    const onRequestClose = () => {
        closeModal();
    }

    const onConfirmEdit = async () => {
        await load(migrationSetService.renameMigrationSet)(migrationSetEdit);
        updateSession(((draft) => {
            draft.set.migrationSetName = migrationSetEdit.migrationSetName;
        }));
        onRequestClose();
        toast.success('Migration set updated successfully');
    }

    const onChangeMigrationSetEdit = (field: FieldMigrationSetEditType, value: string) => {
        updateSession((draft) => {
            draft.migrationSetEdit[field] = value;
        })
    }

    const commentsSection = () => {
        return set.comments ? (
            <div>
                <FileHeaderLabel>Comments:</FileHeaderLabel>
                <FileHeaderValue>{set.comments}</FileHeaderValue>
            </div>
        ) : (
            <></>
        );
    };
    return (
        <WindowContainer>
            <Loading loading={loading} />
            <TabContainer>
                <FileHeaderContainer>
                    <FileHeaderSection>
                        <div>
                            <FileHeaderLabel>Type:</FileHeaderLabel>
                            <FileHeaderValue>Migration Set</FileHeaderValue>
                        </div>
                        <div>
                            <FileHeaderLabel>Name:</FileHeaderLabel>
                            <FileHeaderValue>{set.migrationSetName}</FileHeaderValue>
                        </div>
                        <div>
                            <FileHeaderLabel>Guid:</FileHeaderLabel>
                            <FileHeaderValue>{set.migrationSetGuid}</FileHeaderValue>
                        </div>
                        <div>
                            <FileHeaderLabel>Owner:</FileHeaderLabel>
                            <FileHeaderValue>{set.lastModifiedBy}</FileHeaderValue>
                        </div>
                    </FileHeaderSection>

                    <FileHeaderSection>
                        <div>
                            <FileHeaderLabel>Status:</FileHeaderLabel>
                            <FileHeaderValue>{MigrationSetStatusEnum.getEnumFromCode(set.status).value}</FileHeaderValue>
                        </div>
                        {commentsSection()}
                        <Actions>
                            <ButtonAction
                                label='Actions'
                                type='primary'
                                anchorRef={anchorRef}
                                openAction={openActionButton}
                                onClick={() => setOpenActionMenu(!openActionButton)}
                                showIcon
                            />
                        </Actions>
                    </FileHeaderSection>
                </FileHeaderContainer>

                <div className={classes.migrationSetContainer}>
                    <MigrationSetContent data={data} />
                </div>
            </TabContainer>

            <PopOverMenu
                anchorRef={anchorRef}
                openAction={openActionButton}
                itemsMenu={itemsMenu}
                setOpenAction={setOpenActionMenu}
                handleClose={handleCloseMenuAction}
            />

            <ModalEditMigrationSet
                isModalOpen={isModalOpen}
                onRequestClose={onRequestClose}
                data={migrationSetEdit}
                onChange={onChangeMigrationSetEdit}
                onConfirm={onConfirmEdit}
            />
       </WindowContainer>
    );
};

MigrationSetContentTab.defaultProps = {
    reportService: defaultReportsService,
    migrationSetService: defaultMigrationSetService
};
export default MigrationSetContentTab;
