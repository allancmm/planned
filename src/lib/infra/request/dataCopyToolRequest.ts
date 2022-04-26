
export class DataCopyToolRequest {
    public sequenceName: string = '';
    public sourceEnvironmentId?: string;
    public destinationEnvironmentId?: string;
    public elementGUID: string = '';
    public numberOfCopies?: number;
    public prefixPolicyNumber: string = '';
}
