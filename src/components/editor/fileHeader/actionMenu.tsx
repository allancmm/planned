import React, {ReactNode, useContext, useMemo, useRef,useEffect, useState} from 'react';
import FunctionalTestSuiteSession from '../../../lib/domain/entities/tabData/functionalTestSuiteSession';
import LongJob from '../../../lib/domain/util/longJob';
import AutomatedTestService from '../../../lib/services/automatedTestService';
import InputText, { Options } from '../../general/inputText';
import ModalDialog from '../../general/modalDialog';
import { useModal } from '@equisoft/design-elements-react';
import { toast } from 'react-toastify';
import {
    defaultAutomatedTestService,
    defaultEntitiesService,
    defaultEntityInformationService,
    defaultHistoryService,
    defaultReportsService,
} from '../../../lib/context';
import EntityInformation from '../../../lib/domain/entities/tabData/entityInformation';
import HistoryDocument from '../../../lib/domain/entities/tabData/historyDocument';
import EntityService from '../../../lib/services/entitiesService';
import EntityInformationService from '../../../lib/services/entityInformationService';
import ReportService from '../../../lib/services/reportService';
import { useCurrentEnvironment } from '../../../page/authContext';
import { RightbarContext } from '../../general/sidebar/rightbarContext';
import { TabLoadingContext, useTabActions, useTabWithId } from '../tabs/tabContext';
import { CLOSE, OPEN } from '../tabs/tabReducerTypes';
import { MenuContainer, MoreIcon } from './style';
import { DuplicateEntity } from '../../../lib/domain/entities/duplicateEntity';
import PopOverMenu, { ItemPopOverMenu } from '../../general/popOverMenu';
import HistoryService from '../../../lib/services/historyService';
import useModalPackages from './useModalPackages';
import { SidebarContext } from '../../general/sidebar/sidebarContext';

interface MoreMenuProps {
    tabId: string;
    entityInformationService: EntityInformationService;
    entityService: EntityService;
    reportService: ReportService;
    automatedTestService: AutomatedTestService;
    historyService: HistoryService;
}

export const MoreMenu = ({ tabId, entityInformationService, entityService, reportService, automatedTestService, historyService }: MoreMenuProps) => {
    const { openRightbar } = useContext(RightbarContext);

    const env = useCurrentEnvironment();

    const { load } = useContext(TabLoadingContext);
    const dispatch = useTabActions();
    const tab = useTabWithId(tabId);
    const longJob: LongJob = new LongJob();

    const { modalPackages,
        isModalPackagesOpen,
        openModalPackages,
        closeModalPackages,
        addToPackage } =
        useModalPackages(tab.data.getGuid(),
            tab.data.getName(),
            () => deleteRule(true), { title: 'Add delete entity to config package', confirmLabel: 'Confirm and delete' });

    const {
        isModalOpen,
        closeModal,
        openModal,
    } = useModal();

    const { toggleRefreshSidebar } = useContext(SidebarContext);

    const [dialogProps, setDialogProps] = useState({});
    const [selectedReport, setSelectedReport] = useState('');
    const anchorRef = useRef<HTMLDivElement>(null);
    const [openAction, setOpenAction] = useState(false);
    const [hasCurrentVersion, setHasCurrentVersion] = useState<boolean>();

    useEffect(() => {
        fetchIvsVersion();
    }, [tab.data]);

    const fetchIvsVersion = () => {
        load(async () => {
            const content = await historyService.getLatestVersion(tab?.data?.getGuid() || '');
            if (content) {
                setHasCurrentVersion(content.versionGuid !== null);
            }
        })();
    };

    const openHistory = () => {
        const historyData = new HistoryDocument(
            tab.data.getGuid(),
            tab.data.getName(),
            tab.data.getType(),
            tab.data instanceof EntityInformation ? tab.data.fileType : 'DEFAULT',
            env,
            tab.data.status,
        );
        dispatch({ type: OPEN, payload: { data: historyData } });
    };

    const openMigrationReport = load(async () => {
        const data = await reportService.getIvsHistoryReport(tab.data.getGuid())
        const display = " <div><pre>" + JSON.stringify(data, null, 2) + "</pre></div>"
        const newtab = window.open('about:blank', '_blank');
        newtab?.document.write(display);
        newtab?.document.close();
    });

    const resolveCopyBooks = load(async () => {
        const entityInformation: EntityInformation = await entityInformationService.getResolvedEntityInformation(
            tab.data.getType(),
            tab.data.getGuid(),
            tab.data instanceof EntityInformation ? tab.data.fileType : 'DEFAULT',
        );
        dispatch({ type: OPEN, payload: { data: entityInformation } });
    });

    const openPreviousReports = async () => {
        const resp = await automatedTestService.getReportsByTestSuite((tab.data as FunctionalTestSuiteSession).testSuiteName);
        openDialog(<div>
            <InputText
                type="select"
                label="Reports available:"
                value={selectedReport}
                onChange={(e: Options) => {
                    setSelectedReport(() => e.value);
                    longJob.resultData = {reportFolder: e.value};
                }}
                options={resp.sort().map((r) => ({ label: r.label, value: r.folderName }))}
                placeholder="Select One"
            />
        </div>, onDownloadReport, 'Previous Reports', 'Download');
    };

    const openDialog = (children: ReactNode, onConfirm: () => void, title?: string, button?: string) => {
        openModal();
        setDialogProps({
            children,
            confirmButton: { onConfirm, label: button?? 'Confirm'},
            title: title?? 'Confirmation Required',
        });
    };

    const closeDialog = () => {
        closeModal();
        setDialogProps({});
    };

    const getDialogProps = () => {
        return {
            isOpen: isModalOpen,
            onRequestClose: closeDialog,
            children: <></>,
            ...dialogProps,
        };
    };

    const onClickDeleteWithPackage = () => {
        openModalPackages();
    }
    const deleteRule = async (addToPkg: boolean) => {
        closeModalPackages();
        const canDelete = await load(entityService.canDelete)(tab.data.getType(), tab.data.getGuid());
        if (!canDelete) {
            toast.error('The rule must be in a checkin status in order to be deleted');
        } else {
            if (addToPkg) {
                await onConfirmDeleteRule(addToPkg)
            } else {
                openDialog(<div>Are you sure you want to delete {tab.data.getName()}</div>, onConfirmDeleteRule.bind(null, addToPkg));
            }
        }
    };

    const onConfirmDeleteRule = load(async (addToPkg: boolean) => {
        closeModal();
        await entityService.delete(tab.data.getType(), tab.data.getGuid());
        toast.success('Entity deleted successfully');
        toggleRefreshSidebar();
        dispatch({ type: CLOSE, payload: { id: tabId, layoutId: 0 }});
        if(addToPkg) {
            await addToPackage();
        }
    });

    const onDownloadReport = load(async() => {
        automatedTestService.downloadReport(longJob);
        closeModal();
    });

    const openEntityDuplication = async () => {
        const data = tab.data as EntityInformation;
        const { typeCode, oipaRule: { ruleName, override: { overrideTypeCode } } } = data;
        const sourceEntityGuid = data.getGuid();
        const entityType = tab.data.getType();
        const duplicateEntity = new DuplicateEntity(overrideTypeCode, sourceEntityGuid, typeCode, ruleName);
        openRightbar('Duplicate_Entity', { source: duplicateEntity, entityType });
    };

    const addAttachedRules = () => {
        const ruleGuid = tab.data.getGuid();
        const ruleType = tab.data.getType();
        openRightbar('Add_Attached_Rules', { ruleGuid, ruleType });
    }
    const itemsMenuAction = useMemo(() : ItemPopOverMenu[] => {
        const actionsList: ItemPopOverMenu[] = [];

        const dataType = tab.data.getType();

        if (dataType === 'RATE') {
            actionsList.push({ label: 'Delete Entity', value: 'deleteEntity', onClick: () => deleteRule(false) });
        } else if (dataType === 'FUNCTIONAL_TEST_SUITE') {
            actionsList.push({ label: 'Previous Reports', value: 'previousReport',  onClick: openPreviousReports});
        } else {
            actionsList.push(
                { label: 'Info', value: 'info', onClick: () => openRightbar('Info')},
                { label: 'History', value: 'history', onClick: openHistory , disabled: !hasCurrentVersion},
                { label: 'Migration Report', value: 'migrationReport', onClick: openMigrationReport});
            switch (dataType) {
                case 'TRANSACTIONS':
                    actionsList.push(
                        { label: 'Resolve CopyBooks', value: 'resolveCopyBooks', onClick: resolveCopyBooks},
                        { label: 'Add Attached Rules', value: 'addAttachedRules', onClick: addAttachedRules},
                        { label: 'Duplicate', value: 'duplicate', onClick: openEntityDuplication }
                    );
                    break;
                case 'BUSINESS_RULES':
                    actionsList.push(
                        { label: 'Resolve CopyBooks', value: 'resolveCopyBooks', onClick: resolveCopyBooks },
                        { label: 'Duplicate', value: 'duplicate', onClick: openEntityDuplication });
                    break;
                case 'REQUIREMENT':
                        actionsList.push(
                            { label: 'Resolve CopyBooks', value: 'resolveCopyBooks', onClick: resolveCopyBooks },
                            { label: 'Add Attached Rules', value: 'addAttachedRules', onClick: addAttachedRules });
                    break;
                case 'INQUIRY_SCREEN':
                case 'SEGMENT_NAME':
                    actionsList.push({ label: 'Resolve CopyBooks', value: 'resolveCopyBooks', onClick: resolveCopyBooks });
                    break;
                case 'PLAN':
                case 'PRODUCT':
                case 'MAP' :
                    actionsList.push({ label: 'Duplicate', value: 'duplicate', onClick: openEntityDuplication });
                    break;
            }

            actionsList.push(
                { label: 'Delete Entity', value: 'deleteEntity', onClick: () => deleteRule(false) },
                { label: 'Delete with Package', value: 'deleteWithPackage', onClick: onClickDeleteWithPackage });
        }

        return actionsList;
    }, [tab.data, hasCurrentVersion]);

    return (
        <>
            {isModalOpen && <ModalDialog {...getDialogProps()} />}

            <MenuContainer ref={anchorRef}>
                <MoreIcon
                   onClick={() => setOpenAction((isPrevOpen) => !isPrevOpen)}
                />
            </MenuContainer>

            <PopOverMenu openAction={openAction}
                         setOpenAction={setOpenAction}
                         anchorRef={anchorRef}
                         itemsMenu={itemsMenuAction}
                         handleClose={() => setOpenAction(false)}
                         isCloseAfter
            />

            {isModalPackagesOpen && modalPackages()}
        </>
    );
};

MoreMenu.defaultProps = {
    entityInformationService: defaultEntityInformationService,
    entityService: defaultEntitiesService,
    reportService: defaultReportsService,
    automatedTestService: defaultAutomatedTestService,
    historyService: defaultHistoryService
};

export default MoreMenu;
