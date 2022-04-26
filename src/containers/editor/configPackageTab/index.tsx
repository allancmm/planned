import React, {ReactElement, RefObject, useContext, useEffect, useRef, useState, MouseEvent} from 'react';
import {
    CollapseContainer,
    Loading,
    SplitWrapper,
    useLoading,
    WindowContainer,
} from 'equisoft-design-ui-elements';
import produce, { Draft } from 'immer';
import { Button, IconButton } from "@equisoft/design-elements-react";
import { toast } from 'react-toastify';
import ConfigPackageComments from '../../../components/configPackageTab/configPackageComments';
import ConfigPackageReviewersWizard from '../../../components/configPackageTab/configPackageReviewers';
import {
    ActionButtons,
    Actions,
    FileHeaderContainer,
    FileHeaderLabel,
    FileHeaderSection,
    FileHeaderValue,
} from '../../../components/editor/fileHeader/style';
import {TabContext, useTabActions, useTabWithId} from '../../../components/editor/tabs/tabContext';
import {EDIT_TAB_DATA, MONACO_DISPOSE} from '../../../components/editor/tabs/tabReducerTypes';
import PopOverMenu from '../../../components/general/popOverMenu';
import GroupedEntitySummaryList from '../../../components/general/sidebar/entitySummary/groupedEntitySummaryList';
import { RightbarContext } from '../../../components/general/sidebar/rightbarContext';
import { SidebarContext } from '../../../components/general/sidebar/sidebarContext';
import { defaultConfigPackageService } from '../../../lib/context';
import ConfigPackageContent, {DataByEnvironment} from '../../../lib/domain/configPackageContent';
import ConfigPackage from '../../../lib/domain/entities/configPackage';
import ConfigPackageSession from '../../../lib/domain/entities/tabData/configPackageSession';
import { ConfigPackageStatusEnum } from '../../../lib/domain/enums/configPackageStatus';
import ConfigPackageService from '../../../lib/services/configPackageService';
import {useCurrentEnvironment, useUsername} from '../../../page/authContext';
import MonacoDiff from '../monaco/monacoDiff';
import CompareConfigPackageHeader from './compareConfigPackageHeader';
import {
    ConfigPackageContainer,
    ConfigPackageTabSidePanel,
    ConfigPackageDescription, ConfigPackageContentContainer, ButtonContent
} from './style';

interface ConfigPackageTabProps {
    tabId: string;
    layoutId: number;
    configPackageService: ConfigPackageService;
}

type ConfigPackageActions = 'ReadyToMigrate' | 'ReadyToReview' | 'Accept' | 'ReworkNeeded';

const ConfigPackageTab = ({ tabId, layoutId, configPackageService }: ConfigPackageTabProps) => {
    const tab = useTabWithId(tabId);
    const env = useCurrentEnvironment();
    const dispatch = useTabActions();
    const userName = useUsername();
    const session = tab.data as ConfigPackageSession;
    const anchorMainRef = useRef<HTMLDivElement>(null);
    const refArray = useRef<HTMLDivElement[]>([]);
    const { openRightbar, closeRightbar } = useContext(RightbarContext);
    const { toggleRefreshSidebar } = useContext(SidebarContext);
    const { refreshTab } = useContext(TabContext);

    const [loading, load] = useLoading();
    const [pkg, setPkg] = useState<ConfigPackage>(session.pkg);
    const [anchorMenu, setAnchorMenu] = useState<RefObject<HTMLDivElement>>(anchorMainRef);
    const [openMainAction, setOpenMainAction] = useState(false);
    const [selectedContent, setSelectedContent] = useState<ConfigPackageContent>(new ConfigPackageContent());

    useEffect(() => {
        fetchContent();
    }, [refreshTab]);

    const updateSession = (recipe: (draft: Draft<ConfigPackageSession>) => void, dispose: boolean = false) => {
        const newSession = produce(session, recipe);
        if (dispose) dispatch({ type: MONACO_DISPOSE, payload: { layoutId, dispose: 'all' } });
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: newSession,
            },
        });
        setPkg(newSession.pkg)
        return newSession;
    };

    const editPackage = (recipe: (draft: Draft<ConfigPackage>) => void) => {
        const pkgChange = produce(pkg, recipe);
        updateSession((draft) => {
            draft.pkg = pkgChange;
        });
        return pkgChange;
    };


    const assignReviewer = async (reviewersName: string[], comments: string) => {
        const newStatePkg : ConfigPackage = {...pkg, description: pkg.comments, reviewersName, comments };
        await savePackage(newStatePkg);
        await setPackageStatus('ReadyToReview');
    };

    const fetchPackage = load(async () => {
        const newPkg = await configPackageService.getPackage(session.configPackageGuid);
        const newComments = await configPackageService.getCommentsOnPackage(session.configPackageGuid);
        updateSession((draft) => {
            draft.pkg = newPkg;
            draft.pkg.reviewersName = newPkg.reviewers.map((rev) => rev.userName);
            draft.comments = newComments;
            draft.editMode = false;
        });
    });

    const fetchContent = load(async () => {
        const content = await configPackageService.getPackageContent(session.configPackageGuid);
        updateSession((draft) => {
            draft.pkgContent = content;
        });
    });

    const removeVersion = load(async (versionGuid: string) => {
        await configPackageService.removeVersionFromPackage(session.configPackageGuid, versionGuid);
        fetchContent();
    });

    const setPackageStatus = load(
        async (action: ConfigPackageActions): Promise<void> => {
            switch (action) {
                case 'ReadyToMigrate':
                    await configPackageService.readyToMigratePackage(pkg.packageGuid);
                    toast.info('Package is now ready to migrate');
                    break;
                case 'ReadyToReview':
                    await configPackageService.readyToReviewPackage(pkg.packageGuid);
                    toast.info('Package is now ready to review');
                    break;
                case 'Accept':
                    await configPackageService.acceptReviewPackage(pkg.packageGuid);
                    toast.info('Package has been accepted');
                    break;
                case 'ReworkNeeded':
                    await configPackageService.refuseReviewPackage(pkg.packageGuid);
                    toast.info('Package needs rework');
                    break;
                default:
                    return;
            }
            await fetchPackage();
            toggleRefreshSidebar();
        },
    );

    const getPackageActions = (): ReactElement[] => {
        const pkgActions: ReactElement[] = [];

        if (pkg.isInReview() && pkg.isReviewerOrOwner()) {
            pkgActions.push(
                <Button
                    key="AcceptButton"
                    buttonType="primary"
                    onClick={() => setPackageStatus('Accept')}
                    disabled={loading || !pkg.reviewersName.includes(userName)}
                >
                    Accept
                </Button>,
            );
        }
        if (pkg.isAccepted()) {
            pkgActions.push(
                <Button
                    key="ReadyToMigrateButton"
                    buttonType="primary"
                    onClick={() => setPackageStatus('ReadyToMigrate')}
                    disabled={loading}
                >
                    Ready To Migrate
                </Button>,
            );
        }
        if (
            (pkg.isReadyToMigrate() || pkg.isInReview() || pkg.isAccepted()) &&
            !pkg.isPackageUsedInMigration &&
            pkg.isReviewerOrOwner()
        ) {
            pkgActions.push(
                <Button
                    key="ReworkNeededButton"
                    buttonType="primary"
                    onClick={() => setPackageStatus('ReworkNeeded')}
                    disabled={loading}
                >
                    Rework Needed
                </Button>,
            );
        }
        if (pkg.isOpen() || pkg.isInReworkNeeded() || pkg.hasMigrationError()) {
            pkgActions.push(
                <Button
                    key="ReadyToReviewButton"
                    buttonType="primary"
                    onClick={() =>
                        openRightbar('Config_PackageReviewers', {
                            configPackage: pkg,
                            isEditMode: true,
                            load: load,
                            editPackage: editPackage,
                            assignReviewer: assignReviewer,
                        })
                    }
                    disabled={session.pkgContent?.length === 0 || loading}
                >
                    Ready To Review
                </Button>,
            );
        }
        return pkgActions;
    };

    const savePackage = load(
        async (newStatePkg: ConfigPackage): Promise<void> => {
            await configPackageService.editPackage(newStatePkg);
            await fetchPackage();
            toast.success('Package saved!');
        },
    );

    const openCompareData = load(async (content: ConfigPackageContent) => {
        const envID = `${env.ivsEnvironment} | ${env.ivsTrack}`;
        const MIGRATED_CODE = 'Migrated';
        const PACKAGED_CODE = 'Packaged';
        let compareData = 'NO DATA';
        let dataVersion = '';

        const contentData: ConfigPackageContent = await configPackageService.getPackageContentData(pkg.packageGuid, content.ruleGuid);

        if(contentData.versionGuid !== null) {
            const dataByEnv: DataByEnvironment = contentData.dataByEnvironment;
            if (dataByEnv[envID]) {
                const versionGuidByNumber = dataByEnv[envID].versionGuidByNumber;
                const keys = Object.keys(versionGuidByNumber);
                const migratedVersions = keys.filter((ver) => ver.includes(MIGRATED_CODE));
                const lastMigratedKey = migratedVersions[migratedVersions.length - 1];
                const currentPackagedKey = keys
                    .find((ver) => ver.includes(contentData.currentVersionNumber.toString()) && ver.includes(PACKAGED_CODE));
                const lastVersionKey = keys[keys.length - 1];
                dataVersion = lastMigratedKey ?? currentPackagedKey ??  lastVersionKey ?? '';
                compareData = await configPackageService.getContentDataByVersion(versionGuidByNumber[dataVersion], contentData.fileType);
            }
        }
        updateSession((draft) => {
            draft.currentPkgContent = contentData;
            draft.currentPkgContent.currentCompareData = compareData;
            draft.currentPkgContent.currentDataVersion = dataVersion;
            draft.currentPkgContent.currentEnvID = envID;
        }, true);
    });

    const itemsMenuAction = [
        { label: 'History', value: 'history', onClick: () => openCompareData(selectedContent), disabled: selectedContent.overrideName === '[RULE DELETED]'},
        { label: 'Remove from package', value: 'remove', onClick: () => removeVersion(selectedContent.versionGuid)}
    ];

    const handleClose = () => {
        setOpenMainAction(false);
    };

    return (
        <WindowContainer>
            <Loading loading={loading} />
            <FileHeaderContainer>
                <FileHeaderSection>
                    <div>
                        <FileHeaderLabel>Type:</FileHeaderLabel>
                        <FileHeaderValue>Config Package</FileHeaderValue>
                    </div>
                    <div>
                        <FileHeaderLabel>Package Name:</FileHeaderLabel>
                        <FileHeaderValue>
                            {pkg.packageName}
                        </FileHeaderValue>
                    </div>
                    <div>
                        <FileHeaderLabel>Guid:</FileHeaderLabel>
                        <FileHeaderValue>{pkg.packageGuid}</FileHeaderValue>
                    </div>
                    <div>
                        <FileHeaderLabel>Owner:</FileHeaderLabel>
                        <FileHeaderValue>{pkg.lastModifiedBy}</FileHeaderValue>
                    </div>
                </FileHeaderSection>

                <FileHeaderSection>
                    <div>
                        <FileHeaderLabel>Status:</FileHeaderLabel>
                        <FileHeaderValue>{ConfigPackageStatusEnum.getEnumFromCode(pkg.status).value}</FileHeaderValue>
                    </div>
                    <Actions>
                        <ActionButtons>{getPackageActions().map((action) => action)}</ActionButtons>
                    </Actions>
                </FileHeaderSection>
            </FileHeaderContainer>
            <SplitWrapper cursor={'col-resize'} direction={'horizontal'} defaultSizes={[20, 80]}>
                <ConfigPackageTabSidePanel>
                    <CollapseContainer title='Description' defaultOpened>
                        <ConfigPackageDescription>
                            <span>{pkg.comments}</span>
                        </ConfigPackageDescription>
                    </CollapseContainer>
                    <CollapseContainer title={'Reviewers'} defaultOpened>
                        <ConfigPackageContainer>
                            <ConfigPackageReviewersWizard
                                configData={{
                                    configPackage: pkg,
                                    isEditMode: false,
                                    load,
                                    assignReviewer,
                                }}
                            />
                        </ConfigPackageContainer>
                    </CollapseContainer>
                    <CollapseContainer title={'Content'} defaultOpened>
                        <ConfigPackageContentContainer>
                            <GroupedEntitySummaryList
                                rows={ session.pkgContent }
                                rowMapper={(c: ConfigPackageContent, index) => ({
                                    id: c.ruleGuid,
                                    entityType: c.ruleType,
                                    name: c.ruleName,
                                    extraInformation: c.overrideName,
                                    onClick: () => openCompareData(c),
                                    actionBar: <ButtonContent>
                                        <IconButton
                                            ref={(refIcon : HTMLDivElement) => {
                                                refArray.current[index] = refIcon;
                                            }}
                                            iconName='moreVertical'
                                            buttonType="tertiary"
                                            onClick={(_: MouseEvent<HTMLButtonElement>) => {
                                                setAnchorMenu({ current: refArray.current[index] });
                                                setOpenMainAction(prev => !prev);
                                                setSelectedContent(c);
                                            }}
                                        />
                                    </ButtonContent>
                                })}
                                select={() => {}}
                            />
                        </ConfigPackageContentContainer>
                    </CollapseContainer>
                    <CollapseContainer
                        title={'Comments'}
                        defaultOpened
                        actions={
                            <Button
                                label='+ ADD'
                                buttonType="tertiary"
                                onClick={() => {
                                    openRightbar('Add_Comment_Config_Package',
                                        { configPackageGuid: session.configPackageGuid,
                                            callback: async () => {
                                                closeRightbar();
                                                toast.success('Comment added to package');
                                                await fetchPackage();
                                            }
                                        });
                                }}
                            />
                        }
                    >
                        <ConfigPackageComments comments={session.comments} />
                    </CollapseContainer>
                </ConfigPackageTabSidePanel>
                {session.currentPkgContent ? session.currentPkgContent.versionGuid !== null ? (
                    <MonacoDiff
                        tabId={tabId}
                        layoutId={layoutId}
                        defaultValueOriginal={session.currentPkgContent.currentVersionXMLData}
                        defaultValueModified={session.currentPkgContent.currentCompareData}
                        readOnly
                        header={
                            <CompareConfigPackageHeader
                                content={session.currentPkgContent}
                                editCompareContent={(content, dispose) =>
                                    updateSession((draft) => {
                                        draft.currentPkgContent = content;
                                    }, dispose)
                                }
                            />
                        }
                    />
                ) : (
                    <div>NO DATA</div>
                ) : (
                    <div>Select a version</div>
                )}
            </SplitWrapper>
            <PopOverMenu
                openAction={openMainAction}
                setOpenAction={setOpenMainAction}
                anchorRef={anchorMenu}
                itemsMenu={itemsMenuAction}
                handleClose={handleClose}
                isCloseAfter
            />
        </WindowContainer>
    );
};

ConfigPackageTab.defaultProps = {
    configPackageService: defaultConfigPackageService,
};

export default ConfigPackageTab;
