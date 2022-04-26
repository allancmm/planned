import { Type } from 'class-transformer';
import GitBranch from './gitBranch';

export default class GitConfig {
    @Type(() => GitBranch) public allBranches: GitBranch[] = [];
    public checkedOutBranch: string = '';

    public remoteRepositoryURL: string = '';
    public isConnectedToRemote: boolean = false;

    public isPasswordRequired: boolean = false;
}
