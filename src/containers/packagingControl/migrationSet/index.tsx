import React, {MouseEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
    CollapseContainer,
    Loading,
    Select,
    useLoading,
} from 'equisoft-design-ui-elements';
import { IconButton, Heading, useModal} from "@equisoft/design-elements-react";
import { Pagination, Label, PopOverMenu, ButtonAction, ItemPopOverMenu, NoRecordsFound, InputSearch, ModalDialog } from "../../../components/general";
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import GroupedEntitySummaryList from '../../../components/general/sidebar/entitySummary/groupedEntitySummaryList';
import { SearchWrapper } from '../../../components/general/sidebar/flexibleDataTable/style';
import {RightbarContext} from '../../../components/general/sidebar/rightbarContext';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { defaultConfigPackageService, defaultMigrationSetService } from '../../../lib/context';
import MigrationSet from '../../../lib/domain/entities/migrationSet';
import MigrationSetList from '../../../lib/domain/entities/migrationSetList';
import MigrateReviewSession from '../../../lib/domain/entities/tabData/migrateReviewSession';
import MigrationHistorySession from '../../../lib/domain/entities/tabData/migrationHistorySession';
import MigrationSetSession from '../../../lib/domain/entities/tabData/migrationSetSession';
import {MigrationSetStatusEnum} from '../../../lib/domain/enums/migrationSetStatus';
import Pageable from '../../../lib/domain/util/pageable';
import ConfigPackageService from '../../../lib/services/configPackageService';
import MigrationSetService from '../../../lib/services/migrationSetService';
import {ActiveFilter, ActiveFilters} from '../../migrationSets/migrationHistory/filterMigrationSet';
import {PackagingControlContent, ButtonContent, ModalContainer} from "../style";
import useDebouncedSearch from "../../../components/general/hooks/useDebounceSearch";
import {toast} from "react-toastify";

interface FilteredMigrationSetsProps {
    configPackageService: ConfigPackageService;
    migrationSetService: MigrationSetService;
}

const FilteredMigrationSets = ({ migrationSetService, configPackageService }: FilteredMigrationSetsProps) => {
    const dispatch = useTabActions();
    const { refreshSidebar } = useContext(SidebarContext);

    const [migrationSetList, setMigrationSetList] = useState<MigrationSet[]>([]);
    const [selectedMigrationSets, setSelectedMigrationSets] = useState<MigrationSet[]>([]);
    const [activeFilter, setActiveFilter] = useState<ActiveFilter>('ALL_MIGRATION_SETS');
    const [migrationSetQueuePage, setMigrationSetQueuePage] = useState(Pageable.withPageOfSize());
    const [isOpen, setIsOpen] = useState(true);
    const [openMainAction, setOpenMainAction] = useState(false);
    const [isMainMenu, setIsMainMenu] = useState(true);
    const [migrationSetChosen, setMigrationSetChosen] = useState<MigrationSet>(new MigrationSet());
    const anchorMainRef = useRef<HTMLDivElement>(null);
    const refArray = useRef<HTMLDivElement[]>([]);

    const { openRightbar, closeRightbar } = useContext(RightbarContext);

    const [anchorMenu, setAnchorMenu] = useState<RefObject<HTMLDivElement>>(anchorMainRef);

    const [loading, load] = useLoading();
    const {
        isModalOpen,
        closeModal,
        openModal
    } = useModal();

    const useSearch = () =>
        useDebouncedSearch((searchParam: string, customParam: string) => {
            fetchMigrationSets(searchParam, customParam);
        });

    const { inputText, setInputText, setCustomParam, searchResults } = useSearch();

    useEffect(() => {
        if(!searchResults.loading) {
            fetchMigrationSets(inputText, activeFilter);
        }
    }, [activeFilter, migrationSetQueuePage.pageNumber, refreshSidebar]);

    const handleRowClick = (set: MigrationSet) => {
        const newSet = selectedMigrationSets.find((s) => s === set);
        setSelectedMigrationSets(
            newSet ? [...selectedMigrationSets.filter((s) => s !== set)] : [...selectedMigrationSets, set],
        );
    };

    const fetchByFilter = (sq: string) =>
        load(async (fetch: (searchQuery: string, page: Pageable) => Promise<MigrationSetList>) => {
            const { page: newPage, migrationSets: newMigrationSets } = await fetch(sq, migrationSetQueuePage);
            migrationSetQueuePage.pageNumber = newPage.pageNumber;
            migrationSetQueuePage.totalElements = newPage.totalElements;
            setMigrationSetQueuePage(Pageable.withPageOfSize(migrationSetQueuePage.size, migrationSetQueuePage.pageNumber, migrationSetQueuePage.totalElements));
            setMigrationSetList(newMigrationSets);
        });

    const fetchMigrationSets = (searchQuery: string, filterParam: ActiveFilter) => {
        switch (filterParam) {
            case 'READY_TO_MIGRATE_MIGRATION_SETS':
                fetchByFilter(searchQuery)(migrationSetService.getAllReadyMigrationSets);
                break;
            case 'SENT_MIGRATION_SETS':
                fetchByFilter(searchQuery)(migrationSetService.getAllSentMigrationSets);
                break;
            case 'RECEIVED_MIGRATION_SETS':
                fetchByFilter(searchQuery)(migrationSetService.getAllReceivedMigrationSets);
                break;
            case 'ALL_MIGRATION_SETS':
            default:
                fetchByFilter(searchQuery)(migrationSetService.getAllMigrationSets);
                break;
        }
    };

    const openMigrationSet =
        load(async (m: MigrationSet) => {
            handleClose();
            const data = await createNewMigrationSetSession(m);
            dispatch({ type: OPEN, payload: { data, reloadContent: true } });
        });

    const createNewMigrationSetSession =  async (m: MigrationSet): Promise<MigrationSetSession> => {
        const pkgs = await migrationSetService.getPackagesInMigrationSet(m.migrationSetGuid);
        const versionsLists = await Promise.all(
            pkgs.packages.map((p) =>
                configPackageService.getVersionInPackage(p.packageGuid).then((vl) => {
                    vl.versions.forEach((v) => (v.fromPackageName = p.packageName));
                    return vl;
                }),
            ),
        );
        const versions = versionsLists
            .flatMap((v) => v.versions)
            .sort((v1, v2) => {
                if (
                    v1.rule.ruleGuid === v2.rule.ruleGuid &&
                    v1.rule.override.overrideGuid === v2.rule.override.overrideGuid
                ) {
                    return v2.versionNumber - v1.versionNumber;
                }
                return v1.rule.ruleGuid.localeCompare(v2.rule.ruleGuid);
            });

        const data = new MigrationSetSession();
        data.set = m;
        data.pkgs = pkgs.packages;
        data.versions = versions;
        return data;
    }

    const deleteMigrationSet = load(async () => {
        closeModal();
        await migrationSetService.deleteMigrationSet(migrationSetChosen?.migrationSetGuid ?? '');
        toast.success('Migration set deleted successfully');
        if(migrationSetQueuePage.pageNumber === 0) {
            fetchMigrationSets(inputText, activeFilter)
        } else {
            setMigrationSetQueuePage(Pageable.withPageOfSize());
        }
    });

    const openMigrationReview = useCallback(load(async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        handleClose();
        const data = new MigrateReviewSession(selectedMigrationSets);
        dispatch({ type: OPEN, payload: { data, reloadContent: true } });
        setSelectedMigrationSets([]);
    }), [selectedMigrationSets]);

    const openMigrationHistory = () => {
        handleClose();
        const data = new MigrationHistorySession();
        dispatch({ type: OPEN, payload: { data } });
    };

    const handleOnClickDelete = () => {
        openModal();
        handleClose();
    };

    const itemsMenuAction = useMemo(() : ItemPopOverMenu[] => {
        if(isMainMenu) {
            return [
                { label: 'Migrate', value: 'migrate', onClick: openMigrationReview, disabled: selectedMigrationSets.length === 0 },
                { label: 'Open Extended View', value: 'openHistory', onClick: openMigrationHistory}
            ];
        }

        return [
            { label: 'Open', value: 'open', onClick: () => openMigrationSet(migrationSetChosen) },
            { label: 'Edit', value: 'edit', onClick: () => openRightBarEditMigrationSet(migrationSetChosen)},
            { label: 'Delete', value: 'delete', onClick: handleOnClickDelete }
        ];
    }, [isMainMenu, migrationSetChosen, selectedMigrationSets, openMigrationReview]);

    const handleClose = () => {
        setOpenMainAction(false);
    };

    const getDialogProps = () => (
        {
            isOpen: isModalOpen,
            title: 'Confirmation Required',
            onRequestClose: closeModal,
            confirmButton: { onConfirm: deleteMigrationSet },
            children: <ModalContainer>
                <Heading type="small" bold className='modal-title'>
                    Are you sure you want to delete this migration set?
                </Heading>
                <Label text={migrationSetChosen?.migrationSetName} />
            </ModalContainer>
        }
    )

    const openRightBarEditMigrationSet = (migrationSet: MigrationSet) => {
        handleClose();
        openRightbar('Edit_Migration_Set', { isEdit: true, migrationSet, callback: callbackEditMigrationSet});
    }

    const callbackEditMigrationSet = async (migrationSet: MigrationSet) => {
        toast.success("Migration Set updated successfully");
        fetchMigrationSet(inputText)
        closeRightbar();
        const data = await createNewMigrationSetSession(migrationSet);
        dispatch({ type: OPEN, payload: { data, reloadContent: true } });
    }

    const fetchMigrationSet = (searchParam = '', pageParam = migrationSetQueuePage) => {
        load(async (newPage: Pageable) =>
            migrationSetService.getAllMigrationSets(searchParam, newPage))(pageParam)
            .then(({ migrationSets, page } : MigrationSetList) => {
                    setMigrationSetQueuePage(Pageable.withPageOfSize(page.size, page.pageNumber, page.totalElements));
                    setMigrationSetList(migrationSets);
                }
            );
    };

    return (
        <CollapseContainer
            title="Migration Sets"
            open={isOpen}
            toggleOpen={() => setIsOpen((prevState) => {
                if(prevState) {
                    setOpenMainAction(false);
                }
                return !prevState;
            })}
            actions={<ButtonAction
                        type='secondary'
                        anchorRef={anchorMainRef}
                        disabled={loading}
                        openAction={openMainAction}
                        onClick={() => {
                            setIsOpen(true);
                            setIsMainMenu(true);
                            setAnchorMenu(anchorMainRef);
                            setOpenMainAction(prev => !prev);
                        }}
                    />
            }
        >
          <>
            <Loading loading={loading} />
            <PackagingControlContent>
                <SearchWrapper>
                    <InputSearch
                        value={inputText}
                        placeholder='Search sets...'
                        onChange={(value) => {
                            setCustomParam(activeFilter);
                            setInputText(value);
                        }}
                    />

                    <Select
                        value={activeFilter}
                        onChange={(e) => {
                            setMigrationSetQueuePage(Pageable.withPageOfSize());
                            setActiveFilter(e.target.value);
                        }}
                        options={ActiveFilters}
                        className='all-migration-sets'
                    />
                </SearchWrapper>

                <GroupedEntitySummaryList
                    rows={migrationSetList}
                    select={handleRowClick}
                    checkbox
                    displayOverrides={false}
                    rowMapper={(set: MigrationSet, index) => ({
                        id: set.migrationSetGuid,
                        entityType: 'MIGRATION_SET',
                        name: `${set.migrationSetName} - ${MigrationSetStatusEnum.getEnumFromCode(set.status).value}`,
                        extraInformation: set.migrationSetName,
                        selected: selectedMigrationSets.some((sm) => sm.migrationSetGuid === set.migrationSetGuid),
                        onClick: () => openMigrationSet(set),
                        onClickCheckbox: () => handleRowClick(set),
                        actionBar: <ButtonContent>
                                        <IconButton
                                            ref={(ref : HTMLDivElement) => {
                                                refArray.current[index] = ref;
                                            }}
                                            iconName='moreVertical'
                                            buttonType="tertiary"
                                            onClick={(_: MouseEvent<HTMLButtonElement>) => {
                                                setAnchorMenu({ current: refArray.current[index] });
                                                setIsMainMenu(false);
                                                setOpenMainAction(prev => !prev);
                                                setMigrationSetChosen(set);
                                            }}
                                        />
                                    </ButtonContent>,
                    })}
                />

                {migrationSetList.length > 0 ?
                    <Pagination
                        className='paginator-migration'
                        activePage={migrationSetQueuePage.pageNumber + 1}
                        totalPages={migrationSetQueuePage.getTotalPage() + 1}
                        numberOfResults={migrationSetQueuePage.totalElements}
                        pagesShown={1}
                        onPageChange={(pageNumber: number) => {
                            setMigrationSetQueuePage(Pageable.withPageOfSize(migrationSetQueuePage.size, pageNumber - 1, migrationSetQueuePage.totalElements));
                        }}
                        disabled={loading}
                    />
                    :
                    <NoRecordsFound />
                }
            </PackagingControlContent>
             <PopOverMenu
                openAction={openMainAction}
                setOpenAction={setOpenMainAction}
                anchorRef={anchorMenu}
                itemsMenu={itemsMenuAction}
                handleClose={handleClose}
             />

              {isModalOpen && <ModalDialog {...getDialogProps()} /> }
          </>
        </CollapseContainer>
    );
};
FilteredMigrationSets.defaultProps = {
    migrationSetService: defaultMigrationSetService,
    configPackageService: defaultConfigPackageService,
};

export default FilteredMigrationSets;
