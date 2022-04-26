import Environment from '../domain/entities/environment';
import EnvironmentList from '../domain/entities/environmentList';
import GitRepoResponse from '../domain/entities/gitRepoResponse';
import {MigrationType} from '../domain/enums/migrationType';
import EnvironmentRepository from '../domain/repositories/environmentRepository';

export default class EnvironmentService {
    constructor(private environmentRepository: EnvironmentRepository) {}

    getEnvironmentList = async (migrationType?: MigrationType): Promise<EnvironmentList> => {
        return this.environmentRepository.getEnvironmentList(migrationType);
    };

    updateEnvironment = async (environment: Environment): Promise<Environment> => {
        return this.environmentRepository.updateEnvironment(environment);
    };

    createEnvironment = async (environment: Environment): Promise<Environment> => {
       return this.environmentRepository.createEnvironment(environment);
    };

    deleteEnvironment = async (id: string): Promise<void> => {
        return this.environmentRepository.deleteEnvironment(id);
    };

    testEnvironment = async (environment: Environment): Promise<boolean> => {
        return this.environmentRepository.testEnvironment(environment);
    };

    getConfiguredEnvironments = async (): Promise<EnvironmentList> => {
        return this.environmentRepository.getConfiguredEnvironments();
    };

    getDeploymentFlow = async (): Promise<EnvironmentList> => {
        return this.environmentRepository.getDeploymentFlow();
    };

    getGitRepo = async () : Promise<GitRepoResponse> => this.environmentRepository.getGitRepo();
}
