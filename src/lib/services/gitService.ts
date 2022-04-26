import GitCommit from '../domain/entities/gitCommit';
import * as GitAssembler from '../infra/assembler/gitAssembler';
import GitBranch from '../domain/entities/gitBranch';
import GitConfig from '../domain/entities/gitConfig';
import GitDiff from '../domain/entities/gitDiff';
import LongJob from '../domain/util/longJob';
import {ApiGateway} from '../infra/config/apiGateway';
import {GitBranchRequest} from '../infra/request/git/gitBranchRequest';
import {GitBuildCommitPushRequest} from '../infra/request/git/gitBuildCommitPushRequest';
import {GitBuildArtifactRequest, GitBuildDiffRequest, GitBuildRequest} from '../infra/request/git/gitBuildRequest';
import {GitCommitRequest} from '../infra/request/git/gitCommitRequest';
import GitCredentialsRequest from '../infra/request/git/gitCredentialsRequest';
import {GitDeployRequest} from '../infra/request/git/gitDeploy';
import {GitPullDeployRequest} from '../infra/request/git/gitPullDeploy';
import {GitPushRequest} from '../infra/request/git/gitPush';
import {GitResetRequest} from '../infra/request/git/gitResetRequest';
import {GitStageRequest} from '../infra/request/git/gitStageRequest';
import {GitUnstageRequest} from '../infra/request/git/gitUnstageRequest';
import Pageable from "../domain/util/pageable";
import GitFileStatusList from "../domain/entities/gitFileStatusList";


export default class GitService {
    constructor(private api: ApiGateway) {
    }

    authUser = async (auth: GitCredentialsRequest): Promise<string> => {
        return this.api.post(`git`, auth, {inType: GitCredentialsRequest});
    };

    fetchGitConfig = async (): Promise<GitConfig> => {
        return this.api.get(`git`, {outType: GitConfig});
    };

    // Commands

    gitBuild = async (request: GitBuildRequest): Promise<LongJob> => {
        return this.api.post(`git/build`, request, {inType: GitBuildRequest, outType: LongJob});
    };

    gitBuildRelease = async (request: GitBuildArtifactRequest): Promise<LongJob> => {
        return this.api.post(`git/releases`, request, {inType: GitBuildArtifactRequest, outType: LongJob});
    };

    gitCommit = async (request: GitCommitRequest): Promise<LongJob> => {
        return this.api.post(`git/commit`, request, {inType: GitCommitRequest, outType: LongJob});
    };

    gitReset = async (request: GitResetRequest): Promise<LongJob> => {
        return this.api.post(`git/reset`, request, {inType: GitResetRequest, outType: LongJob});
    };

    gitPush = async (forcePush: boolean): Promise<LongJob> => {
        return this.api.post(`git/push`, {forcePush}, {inType: GitPushRequest, outType: LongJob});
    };

    gitCheckout = async (branchName: string): Promise<LongJob> => {
        return this.api.post(`git/checkout?branchName=${branchName}`, null, {outType: LongJob});
    };

    gitBuildCommitAndPush = async (request: GitBuildCommitPushRequest): Promise<LongJob> => {
        return this.api.post(`git/build-commit-push`, request, {inType: GitBuildCommitPushRequest, outType: LongJob});
    };

    gitPull = async (): Promise<LongJob> => {
        return this.api.post(`git/pull`, null, {outType: LongJob});
    };

    gitDeploy = async (releaseTemplate: string): Promise<LongJob> => {
        return this.api.post(`git/deploy`, {releaseTemplate}, {inType: GitDeployRequest, outType: LongJob});
    };

    gitPullDeploy = async (releaseTemplate: string, branchName: string): Promise<LongJob> => {
        return this.api.post(
            `git/pull-deploy`,
            {releaseTemplate, branchName},
            {inType: GitPullDeployRequest, outType: LongJob}
        );
    };

    getGitDiff = async (baseCommit: string, newCommit: string): Promise<GitDiff> => {
        return this.api.get(`git/diff?baseCommit=${baseCommit}&newCommit=${newCommit}`, {outType: GitDiff});
    };

    gitDeployDiff = async (baseCommit: string, newCommit: string): Promise<LongJob> => {
        return this.api.post(`git/deploy-diff?baseCommit=${baseCommit}&newCommit=${newCommit}`, null, {outType: LongJob});
    };

    gitBuildDiff = async (request: GitBuildDiffRequest): Promise<LongJob> => {
        return this.api.post(`git/build-diff`, request, {inType: GitBuildDiffRequest, outType: LongJob});
    };

    gitValidate = async (): Promise<LongJob> => {
        return this.api.post(`git/validate`, null, {outType: LongJob});
    };

    createBranch = async (request: GitBranchRequest): Promise<LongJob> => {
        return this.api.post(`git/branches/create`, request, {inType: GitBranchRequest, outType: LongJob});
    };

    createTag = async (tagName: string, message: string): Promise<LongJob> => {
        return this.api.post(`git/tags/${tagName}?message=${message}`, null, {outType: LongJob});
    };

    gitStage = async (gitFiles: string[]): Promise<string> => {
        return this.api.post(`git/stage/`, GitAssembler.toGitStageRequest(gitFiles), {inType: GitStageRequest});
    };

    gitStageAll = async (): Promise<string> => {
        return this.api.post(`git/stageAll/`, null);
    };

    gitUnstage = async (gitFiles: string[]): Promise<string> => {
        return this.api.post(`git/unstage/`, GitAssembler.toGitUnstageRequest(gitFiles), {inType: GitUnstageRequest});
    };

    // Getters

    compareWithMaster = async (branch: string): Promise<string> => {
        return this.api.get(`git/branches/diff?branchName=${branch}&compareBranch=master`);
    };

    getGitStatus = async (page: Pageable, staged: boolean): Promise<GitFileStatusList> =>
        this.api.get(`git/status?staged=${staged}&pageNumber=${page.pageNumber}&size=${page.size}`,
                    { outType: GitFileStatusList });

    getGitCommits = async (sinceRsLogHistory: boolean): Promise<GitCommit[]> => {
        return this.api.getArray(`git/commits?sinceRsLogHistory=${sinceRsLogHistory}`,
            {outType: GitCommit});
    };

    getAllBranches = async (): Promise<GitBranch[]> => {
        return this.api.getArray(`git/branches`, {outType: GitBranch});
    };

    getCurrentBranch = async (): Promise<string> => {
        return this.api.get(`git/branches/checkedOut`);
    };
}
