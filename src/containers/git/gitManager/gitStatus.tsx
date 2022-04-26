import React, {ChangeEvent, useContext, useEffect, useMemo, useRef, useState} from 'react';
import { CollapseContainer,
         Loading,
         useDialog,
         useLoading
} from 'equisoft-design-ui-elements';
import { Pagination, ModalDialog, InputText, PopOverMenu, ButtonAction } from "../../../components/general";
import FlexibleDataTable, { FlexibleDataTableColumn } from '../../../components/general/sidebar/flexibleDataTable';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { defaultGitService } from '../../../lib/context';
import GitFileStatus from '../../../lib/domain/entities/gitFileStatus';
import LongJob from '../../../lib/domain/util/longJob';
import GitService from '../../../lib/services/gitService';
import { TableContainer } from '../../search/searchRules/style';
import Pageable from "../../../lib/domain/util/pageable";
import { GitStatusContainer } from "./style";
import { toast } from "react-toastify";

const dataTableColumns: FlexibleDataTableColumn[] = [
    {
        name: 'File',
        selector: 'path'
    },
    {
        name: 'Status',
        selector: 'status'
    }
];

interface GitStatusProps {
    gitService: GitService;
    staged: boolean;
    isPolling: boolean
    longJob(action: () => Promise<LongJob>): void;
}

const GitStatus = ({ gitService, staged, isPolling, longJob }: GitStatusProps) => {
    const {refreshSidebar, toggleRefreshSidebar} = useContext(SidebarContext);
    const [statusList, setStatusList] = useState<GitFileStatus[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<GitFileStatus[]>([]);
    const [commitMessage, setCommitMessage] = useState('');

    const [commandRan, setCommandRan] = useState(false);
    const [loading, load] = useLoading();
    const [show, toggle] = useDialog();
    const [openAction, setOpenAction] = useState(false);

    const [pageStatus, setPageStatus] = useState<Pageable>(Pageable.withPageOfSize());

    const [isOpen, setIsOpen] = useState(true);
    const anchorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchGitStatusList();
    }, [refreshSidebar, pageStatus.pageNumber]);

    const [commitType, setCommitType] = useState('PARTIAL');

    const openDialog = () => {
        toggle();
    };

    const closeDialog = () => {
        toggle();
        setCommandRan(false);
        setCommitMessage('');
    };

    const fetchGitStatusList = () => {
        load(async () =>
            gitService.getGitStatus(pageStatus, staged))()
            .then(resp  => {
                    const { gitFileStatus, page } = resp;
                    pageStatus.totalElements = page.totalElements;
                    setStatusList(gitFileStatus);
                }
            );
    };

    const handleRowSelect = (status: GitFileStatus) => {
        const newSet = selectedStatus.find((s) => s === status);
        setSelectedStatus(
            newSet ? [...selectedStatus.filter((s) => s !== status)] : [...selectedStatus, status]
        );
    };

    const handleStageUnstage = load(
        async (e: React.MouseEvent<HTMLLIElement, MouseEvent>): Promise<void> => {
            setOpenAction(false);
            e.stopPropagation();
            if (selectedStatus.length > 0) {
                const listStatus = selectedStatus.map((status) => status.path);
                if (!staged) {
                    await gitService.gitStage(listStatus);
                } else {
                    await gitService.gitUnstage(listStatus);
                }
                toast.success('Files updated successfully');
                setSelectedStatus([]);
                setPageStatus(Pageable.withPageOfSize());
                toggleRefreshSidebar();
            }
        }
    );

    const handleStageAll = load(
        async (e: React.MouseEvent<HTMLLIElement, MouseEvent>): Promise<void> => {
            e.stopPropagation();
            setOpenAction(false);
            await gitService.gitStageAll();
            toast.success('Files updated successfully');
            setPageStatus(Pageable.withPageOfSize());
            toggleRefreshSidebar();
        }
    );

    const handleCommit = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.stopPropagation();
        setCommitType('PARTIAL');
        openDialog();
    }

    const handleCommitAll = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        e.stopPropagation();
        setCommitType('ALL');
        openDialog();
    }

    const commitDialogProps = () => {
        const baseProps = {
            isOpen: show,
            onRequestClose: closeDialog,
            title: 'Commit',
            modalHeader: commandRan && <>Commit</>,
        };
        return {
            ...baseProps,
            children: (
                <InputText
                    type="text"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCommitMessage(e.target.value)}
                    value={commitMessage}
                    label="Commit message"
                />
            ),
            confirmPanel: !commandRan,
            confirmButton: {
                onConfirm: () => {
                    setCommandRan(true);
                    longJob(async () => commitType === 'PARTIAL' ?
                        gitService.gitCommit({commitMessage: commitMessage,
                            gitFiles: selectedStatus.map((status) => status.path)
                        })
                        : gitService.gitCommit({commitMessage: commitMessage, gitFiles: ['.']})
                    );
                    setSelectedStatus([]);
                    setPageStatus(Pageable.withPageOfSize());
                    closeDialog();
                }
            }
        };
    };

    const itemsMenuAction = useMemo(() =>
        staged ?
           [
               { label: 'Unstage', onClick:  handleStageUnstage, disabled: selectedStatus.length === 0 || isPolling },
               { label: 'Commit', onClick: handleCommit, disabled: selectedStatus.length === 0 || isPolling },
               { label: 'Commit All', onClick: handleCommitAll, disabled: statusList.length === 0 || isPolling }
           ]
        :
           [
                { label: 'Stage', onClick:  handleStageUnstage, disabled: selectedStatus.length === 0 || isPolling },
                { label: 'Stage All', onClick: handleStageAll, disabled: statusList.length === 0 || isPolling },
           ]
    , [ staged, selectedStatus, statusList ]);

    const handleClose = (_:  React.MouseEvent<Document, MouseEvent>) => {
        setOpenAction(false);
    };

    return (
        <CollapseContainer
            title={staged ? 'Staged' : 'Unstaged'}
            open={isOpen}
            toggleOpen={() => setIsOpen((prevState) => {
                if(prevState) {
                    setOpenAction(false);
                }
                return !prevState;
            })}
            actions={<ButtonAction
                        type='secondary'
                        anchorRef={anchorRef}
                        openAction={openAction}
                        onClick={() => {
                            setOpenAction((isPrevOpen) => !isPrevOpen);
                            setIsOpen(true);
                        }}
                        disabled={loading}
                    />}
        >
            <>
                <Loading loading={loading} />
                <GitStatusContainer>
                    <TableContainer>
                        <FlexibleDataTable
                            columns={dataTableColumns}
                            data={statusList}
                            checkbox
                            onRowClick={handleRowSelect}
                            rowMapper={(s: GitFileStatus) => ({
                                id: s.path,
                                columns: dataTableColumns,
                                value: s,
                                selected: selectedStatus.some((ss) => ss.path === s.path)
                            })}
                        />
                        {statusList.length > 0 &&
                            <Pagination
                                className='pagination-custom'
                                activePage={pageStatus.getPageNumber() + 1}
                                totalPages={pageStatus.getTotalPage() + 1}
                                numberOfResults={pageStatus.totalElements}
                                pagesShown={1}
                                onPageChange={(pageNumber: number) => {
                                    setPageStatus(Pageable.withPageOfSize(pageStatus.size, pageNumber - 1, pageStatus.totalElements));
                                }}
                                disabled={loading}
                            />
                        }
                    </TableContainer>
                </GitStatusContainer>

                <PopOverMenu openAction={openAction}
                             setOpenAction={setOpenAction}
                             anchorRef={anchorRef}
                             itemsMenu={itemsMenuAction}
                             handleClose={handleClose}
                />

                <ModalDialog {...commitDialogProps()} />
            </>
        </CollapseContainer>
    );
};

GitStatus.defaultProps = {
    gitService: defaultGitService
};

export default GitStatus;
