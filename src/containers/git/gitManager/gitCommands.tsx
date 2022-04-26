import {useModal} from '@equisoft/design-elements-react';
import {useDialog} from 'equisoft-design-ui-elements';
import React, {ChangeEvent, RefObject, useEffect, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import InputText, {Options} from '../../../components/general/inputText';
import ModalDialog from '../../../components/general/modalDialog';
import PopOverMenu from '../../../components/general/popOverMenu';
import {MSG_REQUIRED_FIELD} from '../../../lib/constants';
import {defaultGitService, defaultReleaseService} from '../../../lib/context';
import GitCommit from '../../../lib/domain/entities/gitCommit';
import {GitResetType} from '../../../lib/domain/enums/gitResetType';
import LongJob from '../../../lib/domain/util/longJob';
import GitService from '../../../lib/services/gitService';
import ReleaseService from '../../../lib/services/releaseService';
import {AuthContext} from '../../../page/authContext';
import GitDiffs from './gitDiffs';
import {ConfirmElement, GitSectionContainer} from './style';

type GitCommand =
    | 'Create a tag'
    | 'Create new branch'
    | 'Build'
    | 'Build Artifact'
    | 'Push'
    | 'Pull'
    | 'Deploy'
    | 'Build Commit Push'
    | 'Pull Deploy'
    // Problem in the API
    // | 'Validate'
    | 'Deploy Diff'
    | 'Build Diff'
    | 'Reset'
    | '';

const confirmElement =
    <ConfirmElement>
        <p>
            <b>The action you are about to take will modify the OIPA database and cannot be undone</b>
        </p>
        <span>Are you sure you want to proceed?</span>
    </ConfirmElement>;

interface GitCommandsProps {
    currentBranch: string;
    gitService: GitService;
    releaseService: ReleaseService;
    openAction: boolean;
    anchorRef: RefObject<HTMLDivElement>;
    longJob(action: () => Promise<LongJob>): void;
    setOpenAction(open: boolean): void;
}

const GitCommands = ({
                         currentBranch,
                         gitService,
                         releaseService,
                         openAction,
                         setOpenAction,
                         anchorRef,
                         longJob,
                     }: GitCommandsProps) => {

    const [commitMessage, setCommitMessage] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [force, setForce] = useState(false);
    const [releaseName, setReleaseName] = useState('');
    const [description, setDescription] = useState('');
    const [baseCommit, setBaseCommit] = useState('');
    const [newCommit, setNewCommit] = useState('');

    const [templates, setTemplates] = useState<string[]>([]);
    const [gitCommand, setGitCommand] = useState<GitCommand>('');

    const [rebaseRules, setRebaseRules] = useState(false);
    const [rebaseMaps, setRebaseMaps] = useState(false);
    const [rebaseRate, setRebaseRate] = useState(false);
    const [rebaseCode, setRebaseCode] = useState(false);

    const [commandRan, setCommandRan] = useState(false);

    const [checkout, setCheckout] = useState(true);
    const [name, setName] = useState('');
    const [feedbackName, setFeedbackName] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [message, setMessage] = useState('');

    const [commitList, setCommitList] = useState<GitCommit[]>([]);
    const [selectedResetType, setSelectedResetType] = useState('');
    const [selectedResetCommit, setSelectedResetCommit] = useState('');

    const prevOpen = useRef(open);

    const [show, toggle] = useDialog();

    const {
        isModalOpen: isModalConfirm,
        closeModal: closeModalConfirm,
        openModal: openModalConfirm
    } = useModal();

    const {auth} = React.useContext(AuthContext);
    const fetchTemplates = () => {
        releaseService.getTemplateList().then(setTemplates);
    };

    const fetchCommitList = () => {
        gitService.getGitCommits(false).then(setCommitList);
    };

    const setBaseSelect = (value: string) => {
        setBaseCommit(value);
    };

    const setNewSelect = (value: string) => {
        setNewCommit(value);
    };

    const onConfirmCreateTag = () => {
        if (!name || !message) {
            !name && setFeedbackName(MSG_REQUIRED_FIELD);
            !message && setFeedbackMessage(MSG_REQUIRED_FIELD);
            return;
        }
        setCommandRan(true);
        longJob(async () => gitService.createTag(name, message));
        closeDialog();
    };

    const onConfirmCreateBranch = async () => {
        if (!name) {
            setFeedbackName(MSG_REQUIRED_FIELD);
            return;
        }
        setCommandRan(true);
        longJob(async () => gitService.createBranch({branchName: name, checkoutBranch: checkout}));
        closeDialog();
    };

    const closeDialog = () => {
        toggle();
        setGitCommand('');
        setCommitMessage('');
        setSelectedTemplate('');
        setCommandRan(false);
        setForce(false);
        setReleaseName('');
        setDescription('');
        setSelectedResetType('');
        setSelectedResetCommit('');
    };

    const executeGitCommand = (gc: GitCommand) => {
        setCommandRan(true);
        switch (gc) {
            case 'Create new branch':
            case 'Create a tag':
                setCommandRan(false);
                break;
            // Problem in the API
            // case 'Validate':
            //     longJob(gitService.gitValidate);
            //     break;
            case 'Build':
            case 'Build Commit Push':
            case 'Push':
            case 'Deploy':
            case 'Pull Deploy':
            case 'Build Artifact':
            case 'Deploy Diff':
            case 'Build Diff':
                fetchTemplates();
                setCommandRan(false);
                break;
            case 'Reset':
                fetchCommitList();
                setCommandRan(false);
        }
    };

    const onConfirmPullDeploy = () => {
        setCommandRan(true);
        longJob(async () => {
            switch (gitCommand) {
                case 'Pull Deploy':
                    return gitService.gitPullDeploy(selectedTemplate, currentBranch);
                default:
                    return gitService.gitDeploy(selectedTemplate);
            }
        });
        closeModalConfirm();
    };

    const buildFormProps = () => {
        return (
            <>
                <InputText
                    type="select"
                    value={selectedTemplate}
                    onChange={(e: Options) => setSelectedTemplate(e.value)}
                    options={templates.sort().map((t) => ({label: t, value: t}))}
                    placeholder="Select One"
                />
                {gitCommand === 'Build' ? (
                    <>
                        <InputText
                            type="checkbox"
                            options={[{label: 'Rebase Rules folder', value: 'rebaseRules'}]}
                            checkedValues={[rebaseRules ? 'rebaseRules' : '']}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setRebaseRules(e.target.checked)}
                        />
                        <InputText
                            type="checkbox"
                            options={[{label: 'Rebase Maps folder', value: 'rebaseMaps'}]}
                            checkedValues={[rebaseMaps ? 'rebaseMaps' : '']}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setRebaseMaps(e.target.checked)}
                        />
                        <InputText
                            type="checkbox"
                            options={[{label: 'Rebase Rate folder', value: 'rebaseRate'}]}
                            checkedValues={[rebaseRate ? 'rebaseRate' : '']}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setRebaseRate(e.target.checked)}
                        />
                        <InputText
                            type="checkbox"
                            options={[{label: 'Rebase Code folder', value: 'rebaseCode'}]}
                            checkedValues={[rebaseCode ? 'rebaseCode' : '']}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setRebaseCode(e.target.checked)}
                        />
                    </>) : ''}
            </>
        );
    };

    const commandDialogProps = () => {
        const baseProps = {
            isOpen: show,
            onRequestClose: closeDialog,
            title: !commandRan && gitCommand,
            modalHeader: commandRan && <>{gitCommand}</>,
            confirmPanel: false
        };
        switch (gitCommand) {
            case 'Create new branch':
                return {
                    ...baseProps,
                    children:
                        <>
                            <InputText
                                type="text"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setName(e.target.value);
                                    setFeedbackName('');
                                }}
                                value={name}
                                label="Branch name:"
                                feedbackMsg={feedbackName}
                                required
                            />
                            <InputText
                                type="checkbox"
                                options={[{label: 'Check out new branch', value: 'newBranch'}]}
                                checkedValues={[checkout ? 'newBranch' : '']}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckout(e.target.checked)}
                            />
                        </>
                    ,
                    confirmPanel: !commandRan,
                    confirmButton: {
                        onConfirm: onConfirmCreateBranch
                    }
                };
            case 'Create a tag':
                return {
                    ...baseProps,
                    children:
                        <>
                            <InputText
                                type="text"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setName(e.target.value);
                                    setFeedbackName('');
                                }}
                                value={name}
                                label="Tag name:"
                                feedbackMsg={feedbackName}
                                required
                            />
                            <InputText
                                type="text"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setMessage(e.target.value);
                                    setFeedbackMessage('');
                                }}
                                value={message}
                                label="Message:"
                                feedbackMsg={feedbackMessage}
                                required
                            />
                        </>
                    ,
                    confirmPanel: !commandRan,
                    confirmButton: {
                        onConfirm: onConfirmCreateTag
                    }
                };
            case 'Build Commit Push':
                return {
                    ...baseProps,
                    children: (
                        <>
                            <InputText
                                type="text"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setCommitMessage(e.target.value)}
                                value={commitMessage}
                                label="Commit message"
                            />

                            <InputText
                                type="select"
                                label="Template:"
                                value={selectedTemplate}
                                onChange={(e: Options) => setSelectedTemplate(e.value)}
                                options={templates.sort().map((t) => ({label: t, value: t}))}
                                placeholder="Select One"
                            />

                            <InputText
                                type="checkbox"
                                options={[{label: 'Force push?', value: 'force'}]}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setForce(e.target.checked)}
                            />
                        </>
                    ),
                    confirmPanel: !commandRan,
                    confirmButton: {
                        onConfirm: () => {
                            setCommandRan(true);
                            longJob(() =>
                                gitService.gitBuildCommitAndPush({
                                    branchName: currentBranch,
                                    commitMessage: commitMessage,
                                    forcePush: force,
                                    releaseTemplate: selectedTemplate
                                })
                            );
                            closeDialog();
                        }
                    }
                };
            case 'Build':
            case 'Deploy':
            case 'Pull Deploy':
                return {
                    ...baseProps,
                    children: buildFormProps(),
                    confirmPanel: !commandRan,
                    confirmButton: {
                        onConfirm: () => {
                            switch (gitCommand) {
                                case 'Build':
                                    if (selectedTemplate.length === 0) {
                                        toast.error('Release template must not be empty');
                                    } else {
                                        longJob(async () => gitService.gitBuild({
                                            releaseTemplate: selectedTemplate,
                                            rebaseRules: rebaseRules,
                                            rebaseMaps: rebaseMaps,
                                            rebaseRate: rebaseRate,
                                            rebaseCode: rebaseCode
                                        }));
                                        closeDialog();
                                    }
                                    return;
                                case 'Pull Deploy':
                                case 'Deploy':
                                    if (selectedTemplate.length === 0) {
                                        toast.error('Release template must not be empty');
                                    } else {
                                        toggle();
                                        openModalConfirm();
                                    }
                            }
                        }
                    }
                };
            case 'Build Artifact':
                return {
                    ...baseProps,
                    children: (
                        <>
                            <InputText
                                type="text"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setReleaseName(e.target.value)}
                                value={releaseName}
                                label="Artifact Name:"
                            />
                            <InputText
                                type="text"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                                value={description}
                                label="Description:"
                            />

                            <InputText
                                type="select"
                                numberOfItemsVisible={3}
                                label="Template:"
                                value={selectedTemplate}
                                onChange={(e: Options) => setSelectedTemplate(e.value)}
                                options={templates.sort().map((t) => ({label: t, value: t}))}
                                placeholder="Select One"
                            />
                        </>
                    ),
                    confirmPanel: !commandRan,
                    confirmButton: {
                        onConfirm: () => {
                            setCommandRan(true);
                            longJob(() =>
                                gitService.gitBuildRelease({
                                    name: releaseName,
                                    releaseTemplate: selectedTemplate,
                                    description,
                                    branchName: currentBranch
                                })
                            );
                            closeDialog();
                        }
                    }
                };
            case 'Push':
                return {
                    ...baseProps,
                    children: (
                        <InputText
                            type="checkbox"
                            options={[{label: 'Force push?', value: 'force'}]}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setForce(e.target.checked)}
                        />
                    ),
                    confirmPanel: !commandRan,
                    confirmButton: {
                        onConfirm: () => {
                            setCommandRan(true);
                            longJob(() => gitService.gitPush(force));
                            closeDialog();
                        }
                    }
                };
            case 'Deploy Diff':
                return {
                    ...baseProps,
                    children:
                        <GitDiffs
                            baseCommit={baseCommit}
                            newCommit={newCommit}
                            setBaseSelect={setBaseSelect}
                            setNewSelect={setNewSelect}
                        />,
                    confirmPanel: !commandRan,
                    confirmButton: {
                        onConfirm: () => {
                            setCommandRan(true);
                            longJob(() => gitService.gitDeployDiff(baseCommit, newCommit));
                            closeDialog();
                        }
                    }
                };
            case 'Build Diff':
                return {
                    ...baseProps,
                    children: (
                        <>
                            <InputText
                                type="text"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setReleaseName(e.target.value)}
                                value={releaseName}
                                label="Artifact Name:"
                                required
                            />
                            <InputText
                                type="text"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                                value={description}
                                label="Description:"
                            />
                            <GitDiffs
                                baseCommit={baseCommit}
                                newCommit={newCommit}
                                setBaseSelect={setBaseSelect}
                                setNewSelect={setNewSelect}
                            />
                        </>
                    ),
                    confirmPanel: !commandRan,
                    confirmButton: {
                        onConfirm: () => {
                            setCommandRan(true);
                            longJob(() =>
                                gitService.gitBuildDiff({
                                    name: releaseName,
                                    description,
                                    baseCommit,
                                    newCommit
                                })
                            );
                            closeDialog();
                        }
                    }
                };
            case 'Reset':
                return {
                    ...baseProps,
                    children: (
                        <>
                            <InputText
                                type="select"
                                value={selectedResetType}
                                onChange={(e: Options) => setSelectedResetType(e.value)}
                                options={GitResetType.codes.map((c) => ({ label: c.value, value: c.code }))}
                                placeholder="Reset Type"
                            />
                            <InputText
                                type="select"
                                value={selectedResetCommit}
                                onChange={(e: Options) => setSelectedResetCommit(e.value)}
                                options={commitList.map((c) => ({label: c.displayInfo(), value: c.commitID}))}
                                placeholder="Reset to"
                            />
                        </>
                    ),
                    confirmPanel: !commandRan,
                    confirmButton: {
                        onConfirm: () => {
                            setCommandRan(true);
                            longJob(() =>
                                gitService.gitReset({
                                    gitResetType: selectedResetType,
                                    commitId: selectedResetCommit
                                })
                            );
                            closeDialog();
                        }
                    }
                };
            case 'Pull':
            // Problem in the API
            // case 'Validate':
            default:
                return {...baseProps, isOpen: false};
        }
    };

    const handleClose = () => {
        setOpenAction(false);
    };

    useEffect(() => {
        if (!!prevOpen.current && !open) {
            anchorRef?.current?.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleItemPull = () => {
        handleClose();
        longJob(gitService.gitPull);
    };

    const handleItemDialog = (_: React.MouseEvent<HTMLLIElement, MouseEvent>, dialog: string) => {
        setGitCommand(dialog as GitCommand);
        toggle();
        executeGitCommand(dialog as GitCommand);
        handleClose();
    };

    const itemsMenuAction = [
        {label: 'Create new branch', onClick: handleItemDialog},
        {label: 'Create a tag', onClick: handleItemDialog},
        {label: 'Reset', onClick: handleItemDialog},
        {label: 'Build Commit Push', onClick: handleItemDialog},
        {label: 'Pull Deploy', onClick: handleItemDialog},
        // Problem in the API
        // { label: 'Validate', onClick: handleMenuItem },
        {label: 'Build', onClick: handleItemDialog, disabled: auth.appFunctionDisabled(['GIT_BUILD'])},
        {label: 'Build Artifact', onClick: handleItemDialog, disabled: auth.appFunctionDisabled(['GIT_BUILD'])},
        {label: 'Build Diff', onClick: handleItemDialog, disabled: auth.appFunctionDisabled(['GIT_BUILD'])},
        {label: 'Push', onClick: handleItemDialog, disabled: auth.appFunctionDisabled(['GIT_PUSH'])},
        {label: 'Pull', onClick: handleItemPull},
        {label: 'Deploy', onClick: handleItemDialog, disabled: auth.appFunctionDisabled(['GIT_DEPLOY'])},
        {label: 'Deploy Diff', onClick: handleItemDialog, disabled: auth.appFunctionDisabled(['GIT_DEPLOY'])}
    ];

    return (
        <GitSectionContainer>
            <PopOverMenu openAction={openAction}
                         setOpenAction={setOpenAction}
                         anchorRef={anchorRef}
                         itemsMenu={itemsMenuAction}
                         handleClose={handleClose}
            />

            <ModalDialog {...commandDialogProps()} />

            <ModalDialog
                title={gitCommand}
                children={confirmElement}
                isOpen={isModalConfirm}
                onRequestClose={closeModalConfirm}
                confirmButton={{onConfirm: onConfirmPullDeploy}}
                confirmPanel
            />
        </GitSectionContainer>
    );
};

GitCommands.defaultProps = {
    releaseService: defaultReleaseService,
    gitService: defaultGitService
};

export default GitCommands;
