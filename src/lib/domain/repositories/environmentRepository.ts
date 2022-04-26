import Environment from '../entities/environment';
import EnvironmentList from '../entities/environmentList';
import GitRepoResponse from '../entities/gitRepoResponse';
import {MigrationType} from '../enums/migrationType';

export default interface EnvironmentRepository {
    getEnvironmentList(migrationType?: MigrationType): Promise<EnvironmentList>;
    updateEnvironment(environment: Environment): Promise<Environment>;
    createEnvironment(environment: Environment): Promise<Environment>;
    deleteEnvironment(id: string): Promise<void>;
    getConfiguredEnvironments(): Promise<EnvironmentList>;
    getDeploymentFlow(): Promise<EnvironmentList>;
    testEnvironment(environment: Environment): Promise<boolean>;
    getGitRepo(): Promise<GitRepoResponse>;
}
