export class ConfigPackageCreationRequest {
    public packageName: string = '';
    public description: string = '';
    public comment?: string = '';
    public reviewers?: string[] = [];
    public versionsGuids?: string[] = [];
    public scriptName?: string = '';
    public sqlData?: string = '';
}
