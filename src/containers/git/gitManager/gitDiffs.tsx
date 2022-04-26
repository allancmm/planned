import React, {ChangeEvent, useEffect, useState} from 'react';
import { Loading, TextAreaInput, useLoading } from 'equisoft-design-ui-elements';
import InputText, { Options } from "../../../components/general/inputText";
import { v4 as uuid } from 'uuid';
import { defaultGitService } from '../../../lib/context';
import GitCommit from '../../../lib/domain/entities/gitCommit';
import GitDiff from '../../../lib/domain/entities/gitDiff';
import GitService from '../../../lib/services/gitService';
import { AdjustedInlineField, ProduceButton } from "./style";

interface GitDiffsProps {
    baseCommit: string;
    newCommit: string;
    gitService: GitService;
    setBaseSelect(value: string): void;
    setNewSelect(value: string): void;
}

const GitDiffs = ({
    baseCommit,
    newCommit,
    setBaseSelect,
    setNewSelect,
    gitService
}: GitDiffsProps) => {
    const [gitDiff, setGitDiff] = useState<GitDiff | null>(null);
    const [commitList, setCommitList] = useState<GitCommit[]>([]);

    const [loading, load] = useLoading();

    useEffect(() => {
        fetchGitCommitList();
    }, []);

    const fetchGitCommitList = load(async () => {
        const commits = await gitService.getGitCommits(true);
        setCommitList(commits);
        setBaseSelect(commits[commits.length - 1].commitID);
        setNewSelect(commits[0].commitID);
    });

    const handleGetDiffs = load(
        async (): Promise<void> => {
            await gitService.getGitDiff(baseCommit, newCommit).then(setGitDiff);
        }
    );

    return (
        <>
            <InputText
                type='select'
                label="Base commit:"
                placeholder="Select or input Base Commit ID"
                value={baseCommit}
                onChange={(e: Options) => setBaseSelect(e.value)}
                options={commitList.map((c) => ({label: c.displayInfo(), value: c.commitID}))}
            />

            <InputText
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setBaseSelect(e.target.value)}
                value={baseCommit.slice(0,10)}
                label="Base Commit ID:"
                placeholder="Select or input Base Commit ID"
            />

            <InputText
                type='select'
                label="New commit:"
                placeholder="Select or input New Commit ID"
                onChange={(e: Options) => setNewSelect(e.value)}
                value={newCommit}
                options={commitList.map((c) => ({label: c.displayInfo(), value: c.commitID}))}
            />

            <InputText
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNewSelect(e.target.value)}
                value={newCommit.slice(0,10)}
                label="New Commit ID:"
                placeholder="Select or input New Commit ID"
            />
            <AdjustedInlineField fieldId={uuid()} label="Please confirm the Git diffs: " valid>
                <ProduceButton buttonType="secondary" onClick={handleGetDiffs}>
                    Preview Git Diffs
                </ProduceButton>
            </AdjustedInlineField>

            <Loading loading={loading}/>

            {gitDiff && (
                <>
                    <TextAreaInput
                        label="Preview of git Diff: "
                        value={gitDiff.diffs.join('\n')}
                        rows={20}
                        style={{fontSize: '12px', maxHeight: '120px'}}
                        readOnly
                    />
                </>
            )}
        </>
    );
};

GitDiffs.defaultProps = {gitService: defaultGitService};

export default GitDiffs;
