import React, { useContext, useState} from 'react';
import {useLoading} from 'equisoft-design-ui-elements';
import {SidebarContext} from '../../components/general/sidebar/sidebarContext';
import {PanelTitle} from '../../components/general/sidebar/style';
import {defaultGitService} from '../../lib/context';
import GitConfig from '../../lib/domain/entities/gitConfig';
import GitService from '../../lib/services/gitService';
import withLongJob from '../general/longJob';
import GitLog from './gitManager/gitLog';
import GitStatus from './gitManager/gitStatus';
import GitManager from './gitManager/index';

interface GitPanelProps {
    gitService: GitService;
}

const GitPanel = ({gitService}: GitPanelProps) => {
    const [gitConfig, setGitConfig] = useState<GitConfig>(new GitConfig());
    const [currentBranch, setCurrentBranch] = useState('');

    const {toggleRefreshSidebar} = useContext(SidebarContext);
    const [,load] = useLoading();
    const fetchGitInformation = load(async () => {
        const conf: GitConfig = await gitService.fetchGitConfig();
        setGitConfig(conf);
        setCurrentBranch(conf.checkedOutBranch);
    });

    const onEndJob = () => {
        if (job.jobType === 'GIT_CREATE_BRANCH' || job.jobType === 'GIT_TAG') {
            fetchGitInformation();
        } else {
            toggleRefreshSidebar();
        }
    }

    const [isPolling, job, displayJobLog, startPollingWithAction, jobCalled] = withLongJob(onEndJob);

    return (
        <>
            {/* TODO - Allan - use context instead of passing down parameters */}
            <PanelTitle>Git Source Control</PanelTitle>
            <GitStatus staged isPolling={isPolling} longJob={startPollingWithAction}/>
            <GitStatus staged={false} isPolling={isPolling} longJob={startPollingWithAction}/>
            <GitManager
                gitConfig={gitConfig}
                currentBranch={currentBranch}
                fetchGitInformation={fetchGitInformation}
                longJob={startPollingWithAction}
                />
            <GitLog logContainer={displayJobLog} jobCalled={jobCalled} />
        </>
    );
};

GitPanel.defaultProps = {
    gitService: defaultGitService
};

export default GitPanel;
