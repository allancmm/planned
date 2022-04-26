import { immerable } from 'immer';

export default class Environment {
    [immerable] = true;

    public identifier: string = '';
    public displayName: string = '';
    public jndiName: string = '';
    public ivsEnvironment: string =  '';
    public ivsTrack: string = '';
    public gitWorkingDirectoryPath: string = '';
    public gitRepoRelativePath: string = '';
    public deploymentOrder?: number = undefined;
    public urlOIPA: string = '';
}
