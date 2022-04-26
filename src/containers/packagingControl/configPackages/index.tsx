import React, { RefObject, useContext, useEffect, useMemo, useRef, useState, MouseEvent, useCallback } from 'react';
import {
    CollapseContainer,
    CreateSelect,
    Loading,
    useLoading,
} from 'equisoft-design-ui-elements';
import { useModal, Heading, IconButton } from "@equisoft/design-elements-react";
import { Pagination, Label, ModalDialog, InputSearch, PopOverMenu, ButtonAction, ItemPopOverMenu, NoRecordsFound } from "../../../components/general";
import { v4 as uuid } from 'uuid';
import {TabContext, useTabActions} from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import GroupedEntitySummaryList from '../../../components/general/sidebar/entitySummary/groupedEntitySummaryList';
import { SearchWrapper } from '../../../components/general/sidebar/flexibleDataTable/style';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { defaultConfigPackageService, defaultMigrationSetService } from '../../../lib/context';
import ConfigPackage from '../../../lib/domain/entities/configPackage';
import MigrationSet from '../../../lib/domain/entities/migrationSet';
import MigrationSetList from '../../../lib/domain/entities/migrationSetList';
import ConfigPackageSession from '../../../lib/domain/entities/tabData/configPackageSession';
import { ConfigPackageStatusEnum } from '../../../lib/domain/enums/configPackageStatus';
import Pageable from '../../../lib/domain/util/pageable';
import ConfigPackageService from '../../../lib/services/configPackageService';
import MigrationSetService from '../../../lib/services/migrationSetService';
import { ButtonContent, PackagingControlContent, ModalContainer } from '../style';
import { toast } from "react-toastify";
import useDebouncedSearch from "../../../components/general/hooks/useDebounceSearch";
import ConfigPackageList from "../../../lib/domain/entities/configPackageList";
import { RightbarContext } from "../../../components/general/sidebar/rightbarContext";

type TypeDialog = 'addTo' | 'deletePackage' | '';

interface ConfigPackagesProps {
    configPackageService: ConfigPackageService;
    migrationSetService: MigrationSetService;
}

const ConfigPackages = ({ configPackageService, migrationSetService }: ConfigPackagesProps) => {
    const { refreshSidebar, toggleRefreshSidebar } = useContext(SidebarContext);
    const dispatch = useTabActions();

    const [loading, load] = useLoading();
    const { openRightbar, closeRightbar } = useContext(RightbarContext);
    const { toggleRefreshTab } = useContext(TabContext);

    const {
        isModalOpen,
        closeModal,
        openModal
    } = useModal();

    const [packageQueueList, setPackageQueueList] = useState<ConfigPackage[]>([]);
    const [packageQueuePage, setPackageQueuePage] = useState(Pageable.withPageOfSize());

    const [openMigrationSetList, setOpenMigrationSetList] = useState<MigrationSet[]>([]);

    const [selectedConfigPackages, setSelectedConfigPackages] = useState<ConfigPackage[]>([]);
    const [selectedMigrationSet, setSelectedMigrationSet] = useState<MigrationSet | null>();
    const [openMainAction, setOpenMainAction] = useState(false);
    const [isMainMenu, setIsMainMenu] = useState(true);
    const [configPackChosen, setConfigPackChosen] = useState<ConfigPackage>(new ConfigPackage());

    const [isOpen, setIsOpen] = useState(true);
    const anchorMainRef = useRef<HTMLDivElement>(null);
    const refArray = useRef<HTMLDivElement[]>([]);

    const [anchorMenu, setAnchorMenu] = useState<RefObject<HTMLDivElement>>(anchorMainRef);

    const [typeDialog, setTypeDialog] = useState<TypeDialog>('');
    const [packageDelete, setPackageDelete] = useState<ConfigPackage>();

    const useSearch = () => useDebouncedSearch((searchParam: string) => {
        fetchPackagesQueue(searchParam);
    });

    const { inputText, setInputText, searchResults } = useSearch();

    useEffect(() => {
       fetchOpenMigrationSet();
    }, [refreshSidebar]);

    useEffect(() => {
        if(!searchResults.loading){
           fetchPackagesQueue(inputText);
        }
    }, [packageQueuePage.pageNumber, refreshSidebar]);

    const fetchPackagesQueue = (searchParam = '', pageParam = packageQueuePage) => {
        load(async (newPage: Pageable) =>
            configPackageService.getPackageQueue(searchParam, newPage))(pageParam)
            .then(({ packages, page } : ConfigPackageList) => {
                    setPackageQueuePage(Pageable.withPageOfSize(page.size, page.pageNumber, page.totalElements));
                setPackageQueueList(packages);
                }
            );
    };


    const fetchOpenMigrationSet = load(
        async (): Promise<MigrationSetList> => {
            const readySets = await migrationSetService.getReadyToMigrateSets();
            setOpenMigrationSetList(readySets.migrationSets);
            return readySets;
        },
    );

    const deletePackage = load(async (pkg: ConfigPackage) => {
        closeModal();
        await configPackageService.deletePackage(pkg.packageGuid);
        fetchPackagesQueue(inputText, Pageable.withPageOfSize());
        toggleRefreshSidebar();
        toast.success('Package deleted successfully');
    });

    const openPackage = (pkg: ConfigPackage) => {
        handleClose();
        const session = new ConfigPackageSession();
        session.configPackageGuid = pkg.packageGuid;
        session.configPackageName = pkg.packageName;

        session.pkg = pkg;
        session.pkg.reviewersName = pkg.reviewers.map((rev) => rev.userName);
        dispatch({type: OPEN, payload: {data: session}});
    };

    const handlePackageSelection = useCallback((pkg: ConfigPackage) => {
        if (pkg.isReadyToMigrate()) {
            const newPackage = selectedConfigPackages.find((c) => c.packageGuid === pkg.packageGuid);
            setSelectedConfigPackages(
                newPackage ? [...selectedConfigPackages.filter((c) => c.packageGuid !== pkg.packageGuid)] : [...selectedConfigPackages, pkg],
            );
        }
    }, [selectedConfigPackages]);

    const addPackagesToSet = load(async () => {
        closeModal();
        if (selectedMigrationSet) {
            await migrationSetService.addPackageToMigrationSet(
                selectedMigrationSet,
                selectedConfigPackages.map((c) => c.packageName),
            );
            setSelectedConfigPackages([]);
            setSelectedMigrationSet(null);
            toggleRefreshSidebar();
        }
    });

    const handleCreateMigrationSet = load(async (inputValue: string) => {
        closeModal();
        await migrationSetService.createMigrationSet(
            inputValue,
            selectedConfigPackages.map((p) => p.packageName),
        );

        const newOpen: MigrationSetList = await fetchOpenMigrationSet();

        setSelectedMigrationSet(newOpen.migrationSets.find((m) => m.migrationSetName === inputValue));
        setSelectedConfigPackages([]);
        toggleRefreshSidebar();
    });

    const getDialogProps = () => {
        const baseProps = {
            isOpen: isModalOpen,
            title: 'Confirmation Required',
            onRequestClose: closeModal,
            confirmPanel: true
        };

        switch (typeDialog) {
            case 'addTo':
                return {
                    ...baseProps,
                    title: 'Migration Set',
                    children:
                            <CreateSelect
                                placeholder="Create or select set..."
                                onChange={setSelectedMigrationSet}
                                isValidNewOption={(inputValue, _, options) =>
                                    !!inputValue &&
                                    !options.some((c) => c.migrationSetName === inputValue)
                                }
                                onCreateOption={handleCreateMigrationSet}
                                options={openMigrationSetList}
                                getNewOptionData={(inputValue) => {
                                    const set = new MigrationSet();
                                    set.migrationSetGuid = uuid();
                                    set.migrationSetName = `Create new set: "${inputValue}"`;
                                    return set;
                                }}
                                getOptionLabel={(c: MigrationSet) => c.migrationSetName}
                                getOptionValue={(c: MigrationSet) => c.migrationSetGuid}
                                value={selectedMigrationSet}
                            />,
                    confirmButton: { onConfirm: addPackagesToSet }
                }
            case "deletePackage":
                return {
                    ...baseProps,
                    children:
                        <ModalContainer>
                            <Heading type="small" bold className='modal-title'>
                            Are you sure you want to delete this package?
                            </Heading>
                            <Label text={packageDelete?.packageName} />
                        </ModalContainer>,
                    confirmButton: { onConfirm: deletePackage.bind(null, packageDelete) }

                }
            default: return baseProps;
        }
    }

    const handleClose = () => {
        setOpenMainAction(false);
    };

    const handleMenuItem = (_: any, value: TypeDialog) => {
        setTypeDialog(value);
        openModal();
        handleClose();
    }

    const callbackManipulateConfigPackage = (_: ConfigPackage) => {
        fetchPackagesQueue(inputText);
        toast.success("Package updated successfully");
        closeRightbar();
        toggleRefreshTab();
    }

    const openDialogEditPackage = (configPackage: ConfigPackage) => {
        // TODO - Allan - fix this in the API
        configPackage.description = configPackage.comments;
        configPackage.reviewersName = configPackage.reviewers.map((rev) => rev.userName);
        handleClose();
        openRightbar('Manipulate_Config_Package', { isEdit: true, configPackage, callback: callbackManipulateConfigPackage });
    }

    const itemsMenuAction = useMemo(() : ItemPopOverMenu[] =>  {
        if(isMainMenu) {
            return [{ label: 'Add to Migration Sets', value: 'addTo', onClick: handleMenuItem  }];
        }
        return [
            { label: 'Open', value: 'open', onClick: openPackage.bind(null, configPackChosen) },
            { label: 'Edit', value: 'edit', onClick:  openDialogEditPackage.bind(null, configPackChosen) },
            { label: 'Delete',
              value: 'delete',
              onClick: () => {
                    setPackageDelete(configPackChosen);
                    setTypeDialog('deletePackage');
                    openModal();
                    handleClose();
                }
            }
        ];
    }, [isMainMenu, configPackChosen]);

    return (
        <CollapseContainer
            title="Configuration Packages"
            open={isOpen}
            toggleOpen={() => setIsOpen((prevIsOpen) => {
                if(prevIsOpen) {
                    setOpenMainAction(false);
                }
                return !prevIsOpen;
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
                            placeholder='Search packages...'
                            onChange={setInputText}
                        />
                    </SearchWrapper>

                    <GroupedEntitySummaryList
                        rows={packageQueueList}
                        select={handlePackageSelection}
                        checkbox
                        displayOverrides={false}
                        rowMapper={(pkg: ConfigPackage, index) => ({
                                id: pkg.packageGuid,
                                entityType: 'PACKAGE',
                                name: `${pkg.packageName} - ${ConfigPackageStatusEnum.getEnumFromCode(pkg.status).value}`,
                                extraInformation: pkg.packageName,
                                selected: selectedConfigPackages.some((c) => c.packageGuid === pkg.packageGuid),
                                disableCheckbox: !pkg.isReadyToMigrate(),
                                onClick: () => openPackage(pkg),
                                onClickCheckbox: () => handlePackageSelection(pkg),
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
                                                        setConfigPackChosen(pkg);
                                                    }}
                                                />
                                        </ButtonContent>,
                            })}
                    />

                    {packageQueueList.length > 0 ?
                        <Pagination
                            className='paginator-config'
                            activePage={packageQueuePage.pageNumber + 1}
                            totalPages={packageQueuePage.getTotalPage() + 1}
                            numberOfResults={packageQueuePage.totalElements}
                            pagesShown={1}
                            onPageChange={(pageNumber: number) => {
                                setPackageQueuePage(
                                    Pageable.withPageOfSize(packageQueuePage.size,
                                        pageNumber - 1,
                                        packageQueuePage.totalElements));
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

                <ModalDialog {...getDialogProps()} />
            </>
        </CollapseContainer>
    );
};

ConfigPackages.defaultProps = {
    configPackageService: defaultConfigPackageService,
    migrationSetService: defaultMigrationSetService,
};

export default ConfigPackages;
