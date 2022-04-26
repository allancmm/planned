import React, { useState, useRef } from 'react';
import { CollapseContainer, Loading, useLoading, } from 'equisoft-design-ui-elements';
import GitConfig from '../../../lib/domain/entities/gitConfig';
import LongJob from '../../../lib/domain/util/longJob';
import GitBranchSelector from './gitBranch';
import GitCommands from './gitCommands';

import { GitManagerContainer } from "./style";
import { ButtonAction } from "../../../components/general";

interface GitManagerProps {
    gitConfig: GitConfig;
    currentBranch: string;
    fetchGitInformation(): void;
    longJob(action: () => Promise<LongJob>): void;
}

const GitManager = ({
    gitConfig,
    currentBranch,
    fetchGitInformation,
    longJob
}: GitManagerProps) => {
    const [loading, load] = useLoading();
    const [openAction, setOpenAction] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const anchorRef = useRef<HTMLDivElement>(null);

    return (
        <CollapseContainer
            title="Git"
            open={isOpen}
            toggleOpen={() => setIsOpen((prevState) => {
                if(prevState) {
                    setOpenAction(false);
                }
                return !prevState;
            })}
            actions={<ButtonAction
                        type='secondary'
                        anchorRef={anchorRef}
                        openAction={openAction}
                        onClick={() => {
                            setOpenAction((isPrevOpen) => !isPrevOpen);
                            setIsOpen(true);
                        }}
                        disabled={loading}
                    />}
        >
            <>
                <Loading loading={loading} />
                <GitManagerContainer>
                    <GitBranchSelector
                        gitConfig={gitConfig}
                        currentBranch={currentBranch}
                        fetchGitInformation={fetchGitInformation}
                        longJob={longJob}
                        load={load}
                    />
                    <GitCommands
                        currentBranch={currentBranch}
                        openAction={openAction}
                        setOpenAction={setOpenAction}
                        anchorRef={anchorRef}
                        longJob={longJob}
                    />
                </GitManagerContainer>
            </>
        </CollapseContainer>
    );
};

GitManager.defaultProps = {};

export default GitManager;
