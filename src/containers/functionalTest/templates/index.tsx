import {useModal} from "@equisoft/design-elements-react";
import React, {Fragment, ReactNode, useContext, useEffect, useMemo, useState} from 'react';
import {Button, CollapseContainer, useLoading, Loading} from 'equisoft-design-ui-elements';
import {toast} from 'react-toastify';
import {ModalDialog} from '../../../components/general';
import { AddFolderIcon } from "../automatedTestTree/style";
import { TreeFileIcon } from "../../../components/general/tree/style";
import { faFolderOpen, faFolder } from "@fortawesome/free-solid-svg-icons";
import ActionTypeBadge from "../../editor/functionalTestTab/actionTypeBadge";
import FunctionalTestStepSession from "../../../lib/domain/entities/tabData/functionalTestStepSession";
import { OPEN } from "../../../components/editor/tabs/tabReducerTypes";
import { useTabActions } from "../../../components/editor/tabs/tabContext";
import AutomatedTestTreeTemplateStep
    from "../../../lib/domain/entities/automatedTestItems/tree/automatedTestTreeTemplateStep";
import TypeTest from "./typeTest";
import { TemplatesContainer } from "./style";
import { SidebarContext } from "../../../components/general/sidebar/sidebarContext";
import AutomatedTestService from "../../../lib/services/automatedTestService";
import { defaultAutomatedTestService } from "../../../lib/context";
import InputAddContent from "../../../components/general/inputAddContent";
import AutomatedTestStep from "../../../lib/domain/entities/automatedTestItems/automatedTestStep";
import NoRecordsFound from "../../../components/general/noRecordsFound";

export const nodeGenerator = (node: AutomatedTestTreeTemplateStep, open?: boolean) => (
     node.type === 'FOLDER'
        ? [
            <Fragment key="Folder">
                <TreeFileIcon
                    icon={ open ? faFolderOpen : faFolder }
                    color='darkorange'
                />
            </Fragment>,
        ]
        : [ <ActionTypeBadge type={node?.templateStep?.child?.type} key={node.name} /> ]
);

interface TemplatesProps {
    automatedTestService: AutomatedTestService;
}

const Templates = ({ automatedTestService } : TemplatesProps) => {
    const [loading, load] = useLoading();
    const [dialogProps, setDialogProps] = useState({});
    const dispatch = useTabActions();
    const { refreshSidebar } = useContext(SidebarContext);

    const [templates, setTemplates] = useState<AutomatedTestTreeTemplateStep>();
    const [showInputAddFolder, setShowInputAddFolder] = useState(false);
    const [nameNewFolder, setNameNewFolder] = useState('');

    const lengthTemplates = useMemo(() =>
        templates?.children.reduce((total, item) => total + item.children.length, 0), [templates]);

    useEffect(() => {
        fetchTemplateSteps();
    }, [refreshSidebar]);

    const fetchTemplateSteps = load(async () => {
        setTemplates(await automatedTestService.getAllTemplateSteps());
    });

    const handleItemClick = (node: AutomatedTestTreeTemplateStep) => {
        if(node.type !== 'FOLDER') {
            const stepSession = new FunctionalTestStepSession();
            stepSession.nameTemplateStep = node.name;
            stepSession.templateStepPath = node.path;
            stepSession.templateStep = node.templateStep;
            stepSession.templateStep.modelId = node.templateStep.modelId || 0;
            dispatch({ type: OPEN, payload: { data: stepSession } });
        }
    };

    const onConfirmAddFolder = async () => {
        await load(async () => automatedTestService.createFolder(templates?.path + '@@' + nameNewFolder))();
        await fetchTemplateSteps();
        closeInputAddFolder();
    }

    const closeInputAddFolder = () => {
        setShowInputAddFolder(false);
        setNameNewFolder('');
    }

    const addTemplate = (folderName: string) => {
        const stepSession = new FunctionalTestStepSession();
        stepSession.nameTemplateStep = 'Add template';
        stepSession.templateStepPath = folderName;
        stepSession.templateStep = new AutomatedTestStep();
        stepSession.templateStep.modelId = lengthTemplates || 0;
        stepSession.mode = 'CREATE';
        dispatch({ type: OPEN, payload: { data: stepSession } });
    }

    const {
        isModalOpen,
        closeModal,
        openModal,
    } = useModal();

    const openDialog = (element: ReactNode, onConfirm: () => void) => {
        openModal();
        setDialogProps({
            children: element,
            confirmButton: { onConfirm },
            title: 'Confirmation Required',
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

    const deleteTemplate = async (node: AutomatedTestTreeTemplateStep) => {
        await automatedTestService.deleteTemplate(node.path, node.type === 'FOLDER');
        await fetchTemplateSteps();
        closeDialog();
    };

    const processDeleteTemplate = (node: AutomatedTestTreeTemplateStep) => {
        if (node.type === 'FOLDER' && node.children.length > 0) {
            toast.error("Cannot delete folder - Folder is not empty");
            return;
        }
        openDialog(
            <div>
                Are you sure you want to delete template {node.type === 'FOLDER' ? 'folder ' : ''}<b>{node.name}</b> ?
            </div>,
            () => deleteTemplate(node),
        );
    }

    return (
        <>
            <ModalDialog {...getDialogProps()} />
            <CollapseContainer
                title='Templates'
                defaultOpened
                actions={
                    <Button
                        buttonType="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowInputAddFolder(true);
                        }}>
                    <AddFolderIcon />
                </Button>}
            >
                <TemplatesContainer>
                    <Loading loading={loading} />
                    { templates && templates?.children?.length > 0 ?
                        templates?.children.map((c : AutomatedTestTreeTemplateStep) =>
                            <Fragment key={c.path}>
                                <TypeTest
                                    itemTypeTest={c}
                                    handleItemClick={handleItemClick}
                                    addTemplate={addTemplate}
                                    processDeleteTemplate={processDeleteTemplate}
                                />
                            </Fragment>
                        )
                        : <NoRecordsFound />
                    }
                    {showInputAddFolder &&
                        <InputAddContent
                            className='input-add-folder'
                            value={nameNewFolder}
                            setValue={setNameNewFolder}
                            onConfirm={onConfirmAddFolder}
                            onCancel={closeInputAddFolder}
                        />
                    }
                </TemplatesContainer>
            </CollapseContainer>
        </>
    );
};
Templates.defaultProps = {
    automatedTestService: defaultAutomatedTestService,
}

export default Templates;

