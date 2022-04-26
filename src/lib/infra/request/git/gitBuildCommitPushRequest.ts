export class GitBuildCommitPushRequest {
    public branchName: string = '';
    public commitMessage: string = '';
    public forcePush: boolean = false;
    public releaseTemplate: string = '';
}
