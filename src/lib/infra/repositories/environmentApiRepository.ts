import Environment from '../../domain/entities/environment';
import EnvironmentList from '../../domain/entities/environmentList';
import GitRepoResponse from '../../domain/entities/gitRepoResponse';
import {MigrationType} from '../../domain/enums/migrationType';
import EnvironmentRepository from '../../domain/repositories/environmentRepository';
import { ApiGateway } from '../config/apiGateway';

export default class EnvironmentApiRepository implements EnvironmentRepository {
    constructor(private api: ApiGateway) {}

    getEnvironmentList = async (migrationType?: MigrationType): Promise<EnvironmentList> => {
        return this.api.get(`/environments${migrationType ? `?migrationType=${migrationType}` : ''}`, { outType: EnvironmentList });
    };

    updateEnvironment = async (environment: Environment): Promise<Environment> => {
        return this.api.put(`/environments`, environment, { inType: Environment, outType: Environment });
    };

    createEnvironment = async (environment: Environment): Promise<Environment> =>
        this.api.post(`/environments`, environment, { inType: Environment, outType: Environment });

    deleteEnvironment = async (id: string): Promise<void> => {
        return this.api.delete(`/environments?id=${id}`);
    };

    getConfiguredEnvironments = async (): Promise<EnvironmentList> => {
        return this.api.get(`/environments/configuredEnvironments`, { outType: EnvironmentList });
    };

    getDeploymentFlow = async (): Promise<EnvironmentList> => {
        return this.api.get(`/environments/deploymentFlow`, { outType: EnvironmentList });
    };

    testEnvironment = async (environment: Environment) : Promise<boolean> =>
        this.api.post(`/environments/test`, environment, { inType: Environment });

    getGitRepo = async () : Promise<GitRepoResponse> =>
        this.api.get(`/environments/gitRepo`, { outType: GitRepoResponse });
}
