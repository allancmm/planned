import React, { useEffect, useMemo, useState } from 'react';
import { LoadMethod, useDialog, useLoading } from 'equisoft-design-ui-elements';
import InputText, {Options} from "../../../components/general/inputText";
import { defaultGitService } from '../../../lib/context';
import GitConfig from '../../../lib/domain/entities/gitConfig';
import LongJob from '../../../lib/domain/util/longJob';
import GitCredentialsRequest from '../../../lib/infra/request/git/gitCredentialsRequest';
import GitService from '../../../lib/services/gitService';
import GitAuth from './gitAuth';
import ModalDialog from "../../../components/general/modalDialog";
import { GitSectionContainer, GitBranchContent } from './style';

interface GitBranchProps {
    gitConfig: GitConfig;
    currentBranch: string;
    gitService: GitService;
    load: LoadMethod;
    fetchGitInformation(): void;
    longJob(action: () => Promise<LongJob>): void;
}

const GitBranchSelector = ({
    gitConfig,
    currentBranch,
    gitService,
    load,
    fetchGitInformation,
    longJob,
}: GitBranchProps) => {
    const [compareStatus, setCompareStatus] = useState('');
    const [showAuth, toggleAuth] = useDialog();
    const [loadingDialog, loadDialog] = useLoading();

    const [gitAuth, setGitAuth] = useState(new GitCredentialsRequest());

    useEffect(() => {
        refreshGitInformation();
    }, [gitConfig.checkedOutBranch]);

    const branchesOption = useMemo(() =>
        gitConfig.allBranches.map((b) => ({ label: b.fullName(), value: b.name })), [gitConfig]);

    const refreshGitInformation = load(async () => {
        fetchGitInformation();
        if (gitConfig.checkedOutBranch !== '') {
            await fetchCompareStatusWithMaster(gitConfig.checkedOutBranch);
        }

        if (gitConfig.isPasswordRequired) {
            toggleAuth();
        }
    });

    const fetchCompareStatusWithMaster = async (branch: string) => {
        const newCompareStatus = await gitService.compareWithMaster(branch);
        setCompareStatus(newCompareStatus);
    };

    const checkoutBranch = async (e: Options) => {
        longJob(() => gitService.gitCheckout(e.value));
    };

    const isConnected = gitConfig.isConnectedToRemote && !gitConfig.isPasswordRequired;

    const onConfirmAuth =
        loadDialog(async () => {
            await gitService.authUser(gitAuth);
            toggleAuth();
            fetchGitInformation();
        });

    return (
        <GitSectionContainer>
            <span style={{ color: isConnected ? 'green' : 'red' }}>
                {isConnected ? 'Connected' : 'Not Connected'}:
            </span>
            <p>{gitConfig.remoteRepositoryURL}</p>
            <p>Behind|Ahead: {compareStatus}</p>

            <GitBranchContent>
                <InputText
                    type='select'
                    label="Current branch:"
                    value={currentBranch}
                    onChange={checkoutBranch}
                    options={branchesOption}
                    searchable
                />
            </GitBranchContent>

            <ModalDialog
                title="Authentication Required"
                isOpen={showAuth}
                onRequestClose={toggleAuth}
                confirmButton={{
                    onConfirm: onConfirmAuth
                }}
            >
                <GitAuth gitAuth={gitAuth} setGitAuth={setGitAuth} loading={loadingDialog} />
            </ModalDialog>
        </GitSectionContainer>
    );
};

GitBranchSelector.defaultProps = {
    gitService: defaultGitService,
};

export default GitBranchSelector;
