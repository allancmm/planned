import React, {MouseEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
    CollapseContainer, CreateSelect,
    Loading,
    useLoading,
} from 'equisoft-design-ui-elements';
import { useModal, Heading, IconButton } from "@equisoft/design-elements-react";
import { Label, Pagination, PopOverMenu,
    ButtonAction, ItemPopOverMenu, ModalDialog, InputSearch, NoRecordsFound } from "../../../components/general";
import { toast } from 'react-toastify';
import { useTabActions } from '../../../components/editor/tabs/tabContext';
import { OPEN } from '../../../components/editor/tabs/tabReducerTypes';
import GroupedEntitySummaryList from '../../../components/general/sidebar/entitySummary/groupedEntitySummaryList';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { defaultConfigPackageService, defaultHistoryService } from '../../../lib/context';
import HistoryDocument from '../../../lib/domain/entities/tabData/historyDocument';
import Version from '../../../lib/domain/entities/version';
import Pageable from '../../../lib/domain/util/pageable';
import ConfigPackageService from '../../../lib/services/configPackageService';
import HistoryService from '../../../lib/services/historyService';
import { useCurrentEnvironment } from '../../../page/authContext';
import { ButtonContent, ModalContainer, PackagingControlContent } from '../style';
import ConfigPackage from "../../../lib/domain/entities/configPackage";
import { v4 as uuid } from "uuid";
import ConfigPackageList from "../../../lib/domain/entities/configPackageList";
import { SearchWrapper } from "../../../components/general/sidebar/flexibleDataTable/style";
import useDebouncedSearch from "../../../components/general/hooks/useDebounceSearch";

type TypeDialog = 'addTo' | 'ignoreRules' | 'ignoreRule' | '';

interface ModifiedRulesProps {
    configPackageService: ConfigPackageService;
    historyService: HistoryService;
}

const ModifiedRules = ({ configPackageService, historyService }: ModifiedRulesProps) => {
    const { refreshSidebar, toggleRefreshSidebar } = useContext(SidebarContext);
    const env = useCurrentEnvironment();
    const dispatch = useTabActions();

    const [versionList, setVersionList] = useState<Version[]>([]);
    const [versionPage, setVersionPage] = useState(Pageable.withPageOfSize());
    const [selectedVersions, setSelectedVersions] = useState<Version[]>([]);
    const [isOpen, setIsOpen] = useState(true);
    const [selectedPackage, setSelectedPackage] = useState<ConfigPackage | null>();
    const [openPackagesList, setOpenPackagesList] = useState<ConfigPackage[]>([]);
    const [versionIgnore, setVersionIgnore] = useState<Version>();
    const [typeDialog, setTypeDialog] = useState<TypeDialog>('');
    const [isMainMenu, setIsMainMenu] = useState(true);
    const [openMainAction, setOpenMainAction] = useState(false);
    const [ruleChosen, setRuleChosen] = useState<Version>();

    const useSearch = () => useDebouncedSearch((searchParam: string) => {
        fetchUnpackagedRules(searchParam);
    });

    const { inputText, setInputText, searchResults } = useSearch();

    const ref = useRef<HTMLDivElement>(null);
    const anchorMainRef = useRef<HTMLDivElement>(null);
    const refArray = useRef<HTMLDivElement[]>([]);

    const [anchorMenu, setAnchorMenu] = useState<RefObject<HTMLDivElement>>(anchorMainRef);

    const [loading, load] = useLoading();
    const {isModalOpen, closeModal, openModal } = useModal();

    useEffect(() => {
        fetchOpenPackages();
    }, [refreshSidebar]);

    useEffect(() => {
        if(!searchResults.loading) {
            fetchUnpackagedRules(inputText);
        }
    }, [versionPage.pageNumber, refreshSidebar]);

    const fetchOpenPackages = load(
        async (): Promise<ConfigPackageList> => {
            const newOpenPackagesList = await configPackageService.getOpenedPackage();
            setOpenPackagesList(newOpenPackagesList.packages);
            return newOpenPackagesList;
        },
    );

    const fetchUnpackagedRules = load(
        async (searchParam = '', pageParam = versionPage): Promise<void> => {
            const {versions, page } = await configPackageService.getUnpackagedVersionList(searchParam, pageParam);
            setVersionPage(Pageable.withPageOfSize(page.size, page.pageNumber, page.totalElements));
            setVersionList([...versions]);
        },
    );

    const ignoreVersion = load(
        async (versionGuid: string): Promise<void> => {
            closeModal();
            await configPackageService.ignoreUnpackagedRule(versionGuid);
            await fetchUnpackagedRules(inputText, Pageable.withPageOfSize());
            setSelectedVersions([]);
            toast.success('Version ignored successfully');
        },
    );

    const ignoreVersions = load(
        async (): Promise<void> => {
            setOpenMainAction(false);
            closeModal();
            await configPackageService.ignoreUnpackagedRules(selectedVersions.map((v) => v.versionGuid)).then(toast);
            await fetchUnpackagedRules(inputText);
            setSelectedVersions([]);
        },
    );

    const handleVersionSelection = useCallback((version: Version) => {
        const newVersion = selectedVersions.find((v) => v.versionGuid === version.versionGuid);
        setSelectedVersions(
            newVersion ? [...selectedVersions.filter((v) => v.versionGuid !== version.versionGuid)] : [...selectedVersions, version],
        );
    }, [selectedVersions]);

    const checkForHistory = load(async (v: Version) => {
        handleClose();
        const hasHistory = await historyService.hasHistory(v.rule.ruleGuid, env.identifier);
        if (hasHistory) {
            openHistory(v);
        } else {
            toast('No history available for this rule!');
        }
    });

    const openHistory = (v: Version) => {
        const historyData = new HistoryDocument(v.rule.ruleGuid, v.rule.ruleName, v.rule.entityType, 'DEFAULT', env);
        dispatch({ type: OPEN, payload: { data: historyData } });
    };


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
                    title: 'Configuration Package',
                    children:
                        <CreateSelect
                            placeholder="Create or select package..."
                            onChange={setSelectedPackage}
                            isValidNewOption={(inputValue, _, options) =>
                                !!inputValue && !options.some((c) => c.packageName === inputValue)
                            }
                            onCreateOption={handleCreatePackage}
                            options={openPackagesList}
                            getNewOptionData={(inputValue) => {
                                const pkg = new ConfigPackage();
                                pkg.packageGuid = uuid();
                                pkg.packageName = `Create new package: "${inputValue}"`;
                                return pkg;
                            }}
                            getOptionLabel={(c: ConfigPackage) => c.packageName}
                            getOptionValue={(c: ConfigPackage) => c.packageGuid}
                            value={selectedPackage}
                        />,
                    confirmButton: { onConfirm: addVersionsToPackage }
                }
            case 'ignoreRules':
                return {
                    ...baseProps,
                    children:
                        <ModalContainer>
                            <Heading type="small" bold className='modal-title'>
                                Are you sure you want to ignore those versions?
                            </Heading>

                            {selectedVersions.map((v) => (
                                <Label key={v.versionGuid} text={v.getFormattedName()} />
                            ))}
                        </ModalContainer>,
                    confirmButton: { onConfirm: ignoreVersions }
                };
            case 'ignoreRule':
                return {
                    ...baseProps,
                    children:
                        <ModalContainer>
                            <Heading type="small" bold className='modal-title'>
                                Are you sure you want to ignore this version?
                            </Heading>
                            <Label key={versionIgnore?.versionGuid} text={versionIgnore?.getFormattedName()} />
                        </ModalContainer>,
                    confirmButton: { onConfirm: ignoreVersion.bind(null, versionIgnore?.versionGuid) }
                }
            default: return baseProps;
        }

    }

    const handleClose = () => {
        setOpenMainAction(false);
    };

    const handleCreatePackage = load(async (inputValue: string) => {
        closeModal();
        const pkg = new ConfigPackage();
        pkg.packageName = inputValue;
        pkg.versions = selectedVersions;
        await configPackageService.createPackage(pkg);

        const newOpen: ConfigPackageList = await fetchOpenPackages();

        setSelectedPackage(newOpen.packages.find((p) => p.packageName === inputValue));
        setSelectedVersions([]);
        toggleRefreshSidebar();
    });

    const addVersionsToPackage = load(
        async (): Promise<void> => {
            closeModal();
            if (selectedPackage) {
                await configPackageService.addVersionsToPackage(
                    selectedPackage.packageGuid,
                    selectedVersions.map((version) => version.versionGuid),
                );
                await fetchUnpackagedRules(inputText);
                setSelectedVersions([]);
                setSelectedPackage(null);
                toggleRefreshSidebar();
            }
        },
    );

    const handleMenuItem = (_: any, value: TypeDialog) => {
        handleClose();
        setTypeDialog(value);
        openModal();
    }

    const ignoreRuleMenuItem = useCallback(() => {
        handleClose();
        setVersionIgnore(ruleChosen);
        setTypeDialog('ignoreRule');
        openModal();
    }, [ruleChosen]);

    const itemsMenuAction = useMemo(() : ItemPopOverMenu[] => {
        if(isMainMenu) {
            return [
                { label: 'Ignore rules',
                    value: 'ignoreRules',
                    onClick: handleMenuItem,
                    disabled: selectedVersions.length === 0
                },
                { label: 'Add to Configuration Packages', value: 'addTo', onClick: handleMenuItem  }
            ]
        }
        return [
            { label: 'Ignore',
                value: 'ignore',
                onClick: ignoreRuleMenuItem
            },
            {
                label: 'History',
                value: 'history',
                onClick: checkForHistory.bind(null, ruleChosen)
            }
        ];
    }, [isMainMenu, ruleChosen, ignoreRuleMenuItem, selectedVersions]);

    return (
        <CollapseContainer
            title="Modified Rules"
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
                            placeholder='Search rules...'
                            onChange={setInputText}
                        />
                    </SearchWrapper>

                    <GroupedEntitySummaryList
                        ref={ref}
                        rows={versionList}
                        select={handleVersionSelection}
                        checkbox
                        rowMapper={(v: Version, index ) => ({
                            id: v.versionGuid,
                            entityType: v.rule.entityType,
                            name: v.rule.ruleName,
                            extraInformation: v.rule.override.overrideName,
                            selected: selectedVersions.some((sv) => sv.versionGuid === v.versionGuid),
                            onClick: () => openHistory(v),
                            onClickCheckbox: () => handleVersionSelection(v),
                            actionBar: <ButtonContent>
                                <IconButton
                                    ref={(refIcon : HTMLDivElement) => {
                                        refArray.current[index] = refIcon;
                                    }}
                                    iconName='moreVertical'
                                    buttonType="tertiary"
                                    onClick={(_: MouseEvent<HTMLButtonElement>) => {
                                        setAnchorMenu({ current: refArray.current[index] });
                                        setIsMainMenu(false);
                                        setOpenMainAction(prev => !prev);
                                        setRuleChosen(v);
                                    }}
                                />
                            </ButtonContent>
                        })}
                    />

                    {versionList.length > 0 ?
                        <Pagination
                            className='paginator-rules'
                            activePage={versionPage.pageNumber + 1}
                            totalPages={versionPage.getTotalPage() + 1}
                            numberOfResults={versionPage.totalElements}
                            pagesShown={1}
                            onPageChange={(pageNumber: number) => {
                                setVersionPage(
                                    Pageable.withPageOfSize(versionPage.size,
                                        pageNumber - 1, versionPage.totalElements));
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

ModifiedRules.defaultProps = {
    configPackageService: defaultConfigPackageService,
    historyService: defaultHistoryService,
};

export default ModifiedRules;