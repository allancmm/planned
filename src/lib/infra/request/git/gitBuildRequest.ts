export class GitBuildRequest {
    public releaseTemplate: string = '';
    public rebaseRules?: boolean = false;
    public rebaseMaps?: boolean = false;
    public rebaseRate?: boolean = false;
    public rebaseCode?: boolean = false;
}

export class GitBuildArtifactRequest extends GitBuildRequest {
    public name: string = '';

    public description?: string;
    public branchName: string = '';
}

export class GitBuildDiffRequest {
    public name: string = '';

    public description?: string;
    public baseCommit: string = '';
    public newCommit: string = '';
}
