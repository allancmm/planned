import React, {ChangeEvent, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import ValidateVersionResponse from '../../../lib/domain/entities/validateVersionResponse';
import { ModalDialog, SplitButton } from "../../general";
import {Button, useModal} from "@equisoft/design-elements-react";
import produce from 'immer';
import { toast } from 'react-toastify';
import {
    defaultEntitiesService,
    defaultEntityInformationService,
    defaultSourceControlService
} from '../../../lib/context';
import { APIError, ErrorInformation } from '../../../lib/domain/entities/apiError';
import { STATUS_LOCKED, STATUS_UNLOCKED } from '../../../lib/domain/entities/entityLockStatus';
import { ScmStatusType } from '../../../lib/domain/entities/entityStatus';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import { FileType, fileTypeToDisplayName } from '../../../lib/domain/enums/fileType';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import SourceControlService from '../../../lib/services/sourceControlService';
import { useAppSettings, AuthContext } from '../../../page/authContext';
import useGlobalKeydown from '../../general/hooks/globalKeyDown';
import { SidebarContext } from '../../general/sidebar/sidebarContext';
import { TabLoadingContext, useTabActions, useTabsWithGUID, useTabWithId } from '../tabs/tabContext';
import { EDIT_TAB_DATA, OPEN, STATUS_CHANGED } from '../tabs/tabReducerTypes';
import MoreMenu from './actionMenu';
import SqlResultModal from './sqlScriptModal/sqlResultModal';

import {
    ActionButtons,
    Actions,
    ErrorBlock,
    ErrorBlockList,
    FileHeaderDropdown,
    FileHeaderLabel,
    FileHeaderLabelDropdown,
    FileHeaderSection,
    FileHeaderValue, MoreMenuContainer
} from './style';
import useModalPackages from "./useModalPackages";

interface FileHeaderContainerProps {
    tabId: string;

    extrasInformation?: ReactNode;

    sourceControlService: SourceControlService;
    entityInformationService: EntityInformationService;
    entityService: EntityService;
    toggleDebug?(): void;
}

const FileHeader = ({
                        sourceControlService,
                        entityInformationService,
                        tabId,
                        entityService,
                        toggleDebug,
                        extrasInformation,
                    }: FileHeaderContainerProps) => {
    const dispatch = useTabActions();
    const tab = useTabWithId(tabId);

    const { data } = tab;

    if (!(data instanceof EntityInformation)) {
        return null;
    }
    const { isLockActivated } = useAppSettings();
    const { load, loading } = useContext(TabLoadingContext);
    const { sidebarType, toggleRefreshSidebar } = useContext(SidebarContext);

    const [dialogProps, setDialogProps] = useState({});

    const { modalPackages,
            addToPackage,
            isModalPackagesOpen,
            openModalPackages,
            closeModalPackages } = useModalPackages(data.oipaRule.ruleGuid, data.oipaRule.ruleName, () => checkIn(true), { confirmLabel: 'Confirm and check in'});

    const {
        isModalOpen,
        closeModal,
        openModal,
    } = useModal();

    const { auth } = useContext(AuthContext);

    const [fileId, setFileId] = useState<string>('');

    useEffect(() => {
        getRelatedEntitiesList();
    }, [data.status.status]);

    useEffect(() => {
        getFileId();
    }, []);

    const getFileId = load(async () => {
        if (data.getType() === 'AS_FILE') {
            const id = await entityService.getAsFileId(data.getGuid());
            setFileId(id);
        }
    });

    const tabs = useTabsWithGUID(data.getGuid());

    const displayActions = 'RATE' !== data.getType();
    const disableActions = data.status.status === 'restricted'
    const displayMenu = !displayActions;

    const updateRecentActivities = () => {
        if (sidebarType === 'Home') toggleRefreshSidebar();
    };

    const lock = load(async () => {
        const status = await sourceControlService.lock(data.getType(), data.getGuid());
        dispatch({ type: STATUS_CHANGED, payload: { guid: data.oipaRule.ruleGuid, lock: true, status } });
        updateRecentActivities();
    });

    const unlock = load(async () => {
        const status = await sourceControlService.unlock(data.getType(), data.getGuid());
        dispatch({ type: STATUS_CHANGED, payload: { guid: data.oipaRule.ruleGuid, lock: true, status } });
        updateRecentActivities();
    });

    const checkOut = load(async () => {
        const validateVersionResponse: ValidateVersionResponse = await entityInformationService.validateVersion(data.entityType, data.oipaRule.ruleGuid, data.fileType, data.getChecksum())
        if(validateVersionResponse.sameVersion) {
            await checkOutEntity()
        } else {
            if(validateVersionResponse.supported) {
                openCheckOutErrorDialog(<ErrorBlock>
                    {validateVersionResponse.errorMessage}
                </ErrorBlock>)
            } else {
                await checkOutEntity()
            }
        }
    });

    const checkOutEntity = async() => {
        const status = await sourceControlService.checkOut(data.getType(), data.getGuid());
        dispatch({ type: STATUS_CHANGED, payload: { guid: data.oipaRule.ruleGuid, status } });
        updateRecentActivities();
    }


    const fetchLatestVersion = load( async (reloadContent: boolean = true) => {
        const entityInformation: EntityInformation = await entityInformationService.getEntityInformation(
            data.entityType,
            data.oipaRule.ruleGuid,
            data.fileType,
        );
        entityInformation.extras.reloadContent = reloadContent;
        reloadContent
            ? dispatch({ type: OPEN, payload: { data: entityInformation, reloadContent: true } })
            : dispatch({ type: EDIT_TAB_DATA, payload: { tabId, data: entityInformation } });
    });

    const undoCheckOut = load(async () => {
        await sourceControlService.undoCheckOut(data.getType(), data.getGuid());
        updateRecentActivities();
        await fetchLatestVersion();
    });

    const checkIn = load(async (addToPkg: boolean) => {
        closeModalPackages();
        try {
            // TODO - Allan - only sourceControlService.checkIn should be inside of try/catch. If fetchLatestVersion or addToPackage fails,
            // the modal will open
            const status = await sourceControlService.checkIn(tab.data.getType(), tab.data.getGuid(), tabs);
            dispatch({ type: STATUS_CHANGED, payload: { guid: data.oipaRule.ruleGuid, status } });
            updateRecentActivities();
            await fetchLatestVersion(false);
            if (addToPkg) {
                await addToPackage();
            }
        } catch (error) {
            const err = error as APIError;
            openCheckInErrorDialog(
                <ErrorBlockList>
                    {err.informations?.map((e: ErrorInformation, i: number) => (
                        <ErrorBlock key={i}>{e.extraInformation}</ErrorBlock>
                    ))}
                </ErrorBlockList>,
                err.error !== 'TryCheckInValidation' ||
                !!err.informations.find((e: ErrorInformation) => e.message.toUpperCase().includes('IMPOSSIBLE')),
                addToPkg
            );
        }
    });

    const openLinkedFile = load(async (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const newFileType: FileType = e.target.value as FileType;
        if (newFileType !== data.fileType) {
            const entityInformation: EntityInformation = await entityInformationService.getEntityInformation(
                data.entityType,
                data.oipaRule.ruleGuid,
                newFileType,
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
        } else {
            toast.info(`This tab is already for file type: ${newFileType}`);
        }
    });

    const openRelatedFile = load(async (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const relatedEntity = data.relatedEntities.find((r) => r.ruleGuid === e.target.value);
        if (relatedEntity) {
            const entityInformation: EntityInformation = await entityInformationService.getEntityInformation(
                relatedEntity.entityType,
                relatedEntity.ruleGuid,
                relatedEntity.linkedFiles[0],
            );
            dispatch({ type: OPEN, payload: { data: entityInformation } });
        }
    });

    const getRelatedEntitiesList = load(async () => {
        const newList = await entityInformationService.getRelatedEntities(
            data.oipaRule.entityType,
            data.oipaRule.ruleGuid,
            data.fileType,
        );
        dispatch({
            type: EDIT_TAB_DATA,
            payload: {
                tabId,
                data: produce(data, (draft) => {
                    draft.relatedEntities = newList;
                }),
            },
        });
    });

    const getStatus = (): string => {
        let statusString = '';
        if (data.status.status === ('restricted' as ScmStatusType)) {
            statusString = 'Restricted: Read-only';
        }
        else if (isLockActivated) {
            const lockStatus = data.lockStatus.status;
            if (lockStatus === STATUS_LOCKED && data.status.status === ('checkIn' as ScmStatusType)) {
                statusString += `Locked by ${data.lockStatus.user}`;
            } else if (lockStatus === STATUS_LOCKED && data.status.status === ('checkOut' as ScmStatusType)) {
                statusString += `Locked and CheckOut by ${data.status.user}`;
            } else if (lockStatus === STATUS_UNLOCKED) {
                statusString += `${data.status.status}`;
            } else if (data.status.status === ('checkedBy' as ScmStatusType)) {
                statusString += `${data.status.status} by ${data.status.user}`;
            }
        } else {
            if (data.status.status === ('checkIn' as ScmStatusType)) {
                statusString += `CheckIn`;
            } else if (data.status.status === ('checkOut' as ScmStatusType)) {
                statusString += `CheckOut by ${data.status.user}`;
            } else if (data.status.status === ('checkedBy' as ScmStatusType)) {
                statusString += `${data.status.status} by ${data.status.user}`;
            }
        }

        return statusString;
    };

    const getColor = (): string => {
        let color = '';
        if (isLockActivated) {
            const lockStatus = data.lockStatus.status;
            if (lockStatus === STATUS_LOCKED && data.status.status === ('checkIn' as ScmStatusType)) {
                if (auth.userName === data.lockStatus.user) {
                    color += 'orange';
                } else {
                    color += 'red';
                }
            } else if (lockStatus === STATUS_LOCKED && data.status.status === ('checkOut' as ScmStatusType)) {
                if (auth.userName === data.status.user) {
                    color += 'orange';
                } else {
                    color += 'red';
                }
            } else if (lockStatus === STATUS_UNLOCKED) {
                color += `green`;
            } else if (data.status.status === ('checkedBy' as ScmStatusType)) {
                if (auth.userName === data.status.user) {
                    color += 'orange';
                } else {
                    color += 'red';
                }
            }
        } else {
            if (data.status.status === ('checkIn' as ScmStatusType)) {
                color += color += `green`;
            } else if (data.status.status === ('checkOut' as ScmStatusType)) {
                if (auth.userName === data.status.user) {
                    color += 'orange';
                } else {
                    color += 'red';
                }
            } else if (data.status.status === ('checkedBy' as ScmStatusType)) {
                if (auth.userName === data.status.user) {
                    color += 'orange';
                } else {
                    color += 'red';
                }
            }
        }

        return color;
    };
    const isCheckedIn = data.status.status === 'checkIn' || data.status.status === 'checkedBy';

    const otherFiles = data.oipaRule.linkedFiles.filter((f) => f !== data.fileType);

    const linkedFiles = data.oipaRule.linkedFiles.map((f) => ({ value: f, label: fileTypeToDisplayName(f) }));

    useGlobalKeydown({ keys: ['ctrl', 'u'], onKeyDown: undoCheckOut, tabId }, [undoCheckOut]);
    useGlobalKeydown({ keys: ['ctrl', 'i'], onKeyDown: openModalPackages, tabId }, [openModalPackages]);
    useGlobalKeydown({ keys: ['ctrl', 'o'], onKeyDown: checkOut, tabId }, [checkOut]);
    useGlobalKeydown({ keys: ['ctrl', 'l'], onKeyDown: lock, tabId }, [lock]);
    useGlobalKeydown({ keys: ['ctrl', 'k'], onKeyDown: unlock, tabId }, [unlock]);

    const onConfirm = load(async (addToPkg: boolean) => {
        const status = await sourceControlService.checkIn(tab.data.getType(), tab.data.getGuid(), tabs, true);
        dispatch({ type: STATUS_CHANGED, payload: { guid: data.oipaRule.ruleGuid, status } });
        closeModal();
        updateRecentActivities();
        await fetchLatestVersion(false);
        if (addToPkg) {
            await addToPackage();
        }
        closeModalPackages();
    });

    const getDialogProps = useCallback(() => {
        const baseProps = {
            isOpen: isModalOpen,
            onRequestClose: closeDialog,
            confirmPanel: true,
            confirmButton: {},
            children: <></>,
        };
        return { ...baseProps, ...dialogProps };
    }, [dialogProps, isModalOpen]);

    const openCheckInErrorDialog = (children: ReactNode, impossible: boolean, addToPkg: boolean) => {
        setDialogProps(
            impossible
                ? {
                    confirmPanel: false,
                    children,
                    modalHeader: 'Errors during check-in, impossible to proceed',
                    title: 'Errors during check-in'
                }
                : { children, confirmButton: { onConfirm: onConfirm.bind(null, addToPkg), label: 'Check-in anyways' }, title: 'Errors during check-in' },
        );
        openModal();
    };

    const openCheckOutErrorDialog = (children: ReactNode) => {
        setDialogProps(
             {title: "Entity Version Mismatch" ,
                 children,
                 confirmButton: {onConfirm: fetchLatestVersionAndCloseDialog , label: 'Reload Entity' } },
        );
        openModal();
    };

    const fetchLatestVersionAndCloseDialog = load(async() => {
        await fetchLatestVersion()
        closeDialog()
    })

    const closeDialog = () => {
        setDialogProps({});
        closeModal();
    };

    const isAllFieldsDisabled: boolean = data.fileType === 'DATA' && data.dataFields.every((f) => f.disabled);

    const renderOverride: boolean = data.fileType !== 'PLAN_STATE_APPROVAL' &&
        !['ERROR_CATALOG', 'COUNTRY', 'CURRENCY', 'MARKET', 'SEQUENCE'].includes(data.oipaRule.entityType);

    const renderGuid: boolean = data.fileType !== 'PLAN_STATE_APPROVAL' &&
        !['ERROR_CATALOG', 'COUNTRY', 'CURRENCY', 'MARKET', 'SEQUENCE'].includes(data.oipaRule.entityType);

    const goToOptionsList = data.relatedEntities.map((o) => ({
        value: o.ruleGuid,
        label: o.ruleFullName ? o.ruleFullName : o.ruleName,
        isSeparator: o.ruleType === 'separator',
    }));
    const displayLinkedFiles = otherFiles.length > 0 && data.fileType !== 'PLAN_STATE_APPROVAL';

    const CheckInButton = () =>
        <SplitButton
            label='Check In'
            type='secondary'
            onClick={() => checkIn(false)}
            disabled={loading || disableActions}
            itemsMenu={ [{ label: 'Check into package', onClick: openModalPackages }]}
        />

    return (
        <>
            <FileHeaderSection>
                <div>
                    <FileHeaderLabel>Type:</FileHeaderLabel>
                    <FileHeaderValue>{data.fileType === 'PLAN_STATE_APPROVAL' ? data.fileType : data.entityType}</FileHeaderValue>
                </div>
                <div>
                    <FileHeaderLabel>Name:</FileHeaderLabel>
                    <FileHeaderValue>
                        {['CURRENCY', 'MARKET', 'SEQUENCE', 'COUNTRY', 'ERROR_CATALOG'].includes(data.getType())
                            ? data.getType()
                            : data.getType() === 'WORKFLOW_QUEUE_ROLE'
                                ? data.getGuid()
                                : data.getType() === 'AS_FILE'
                                    ? data.getName() + " - " + fileId
                                    : data.getName()
                        }
                    </FileHeaderValue>
                </div>
                {renderOverride && (
                    <div>
                        <FileHeaderLabel>Override:</FileHeaderLabel>
                        <FileHeaderValue>
                            {data.mapData?.override
                                ? data.mapData.override.overrideName
                                : data.oipaRule.override.overrideName}
                        </FileHeaderValue>
                    </div>
                )}
                {renderGuid && (
                    <div>
                        <FileHeaderLabel>Guid:</FileHeaderLabel>
                        <FileHeaderValue>{data.oipaRule.ruleGuid}</FileHeaderValue>
                    </div>
                )}
                {extrasInformation}
            </FileHeaderSection>
            <FileHeaderSection>
                <div>
                    <FileHeaderLabel>Status:</FileHeaderLabel>
                    <div style={{ color: getColor() }}><FileHeaderValue color={'lightblue'}>{getStatus()}</FileHeaderValue></div>
                </div>
                {displayLinkedFiles && (
                    <div>
                        <FileHeaderLabelDropdown>Linked Files: </FileHeaderLabelDropdown>
                        <FileHeaderDropdown
                            name={'Linked Files'}
                            validationErrorMessage={'Error message'}
                            onChange={openLinkedFile}
                            required={false}
                            options={linkedFiles}
                            value={data.fileType}
                        />
                    </div>
                )}

                {data.getType() === 'SQL_SCRIPT' && <SqlResultModal entityInformation={data} />}
                {goToOptionsList.length > 0 && (
                    <div>
                        <FileHeaderLabelDropdown>Go to: </FileHeaderLabelDropdown>
                        <FileHeaderDropdown
                            name={'Go to'}
                            validationErrorMessage={'Error message'}
                            onChange={openRelatedFile}
                            required={false}
                            options={goToOptionsList}
                            value={data.fileType}
                        />
                    </div>
                )}

                {displayActions && (
                    <Actions>
                        <ActionButtons>
                            {isLockActivated ? (
                                data.lockStatus.status === STATUS_UNLOCKED ? (
                                    <Button onClick={lock} buttonType="secondary" disabled={loading || disableActions}>
                                        Lock
                                    </Button>
                                ) : data.lockStatus.status === STATUS_LOCKED && isCheckedIn ? (
                                    <div>
                                        <Button onClick={unlock} buttonType="tertiary" disabled={loading || disableActions}>
                                            Unlock
                                        </Button>
                                        <Button
                                            buttonType="secondary"
                                            onClick={checkOut}
                                            disabled={loading || isAllFieldsDisabled}
                                        >
                                            Check out
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Button onClick={undoCheckOut} buttonType="tertiary" disabled={loading || disableActions}>
                                            Undo
                                        </Button>
                                        <CheckInButton />
                                    </>
                                )
                            ) : (
                                <>
                                    {data.status.status === 'checkOut' && (
                                        <Button onClick={undoCheckOut} buttonType="tertiary" disabled={loading || disableActions}>
                                            Undo
                                        </Button>
                                    )}
                                    {isCheckedIn ?
                                        <Button
                                            buttonType="secondary"
                                            onClick={checkOut}
                                            disabled={loading || isAllFieldsDisabled || disableActions}
                                        >
                                            Check out
                                        </Button>
                                    :
                                        <CheckInButton />
                                    }
                                </>
                            )}

                            {toggleDebug && data.fileType === 'XML_DATA' && (
                                <Button onClick={toggleDebug} buttonType="tertiary" disabled={disableActions}>
                                    Interpret
                                </Button>
                            )}
                        </ActionButtons>
                        {!disableActions && (
                            <MoreMenuContainer>
                                <MoreMenu tabId={tabId} />
                            </MoreMenuContainer>
                        )}
                    </Actions>
                )}

                {displayMenu && (
                    <Actions>
                        {!disableActions && (
                            <MoreMenuContainer>
                                <MoreMenu tabId={tabId} />
                            </MoreMenuContainer>
                        )}
                    </Actions>
                )}
            </FileHeaderSection>
            {isModalOpen && <ModalDialog {...getDialogProps()} />}

            {isModalPackagesOpen && modalPackages()}
        </>
    );
};

FileHeader.defaultProps = {
    sourceControlService: defaultSourceControlService,
    entityInformationService: defaultEntityInformationService,
    entityService: defaultEntitiesService,
};

export default FileHeader;
