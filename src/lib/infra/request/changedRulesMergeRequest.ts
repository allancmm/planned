export class ChangedRulesMergeRequest {
    public mergeMode: string = '';
    public sourceEnvironmentId: string = '';
    public targetEnvironmentId: string = '';
    public sourceArtifact?: string;
}
