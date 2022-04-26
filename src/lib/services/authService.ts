import AuthData from '../domain/entities/authData';
import BasicEntity from '../domain/entities/basicEntity';
import LoginResponse from '../domain/entities/loginResponse';
import UserSettings from '../domain/entities/userSettings';
import AuthRepository from '../domain/repositories/authRepository';

export default class AuthService {
    constructor(private authRepository: AuthRepository) {}

    setDisconnectHandler(onDisconnect: () => void): void {
        this.authRepository.setDisconnectHandler(onDisconnect);
    }

    getAuthData = async (): Promise<AuthData> => {
        return this.authRepository.getAuthData();
    };

    updateUserSettings = async (userSettings: UserSettings): Promise<void> =>
        this.authRepository.updateUserSettings(userSettings);

    login = async (userName: string, password: string, env: string): Promise<LoginResponse> => {
        return this.authRepository.login(userName, password, env);
    };

    loginSSO = async (idToken: string, env: string): Promise<LoginResponse> => {
        return this.authRepository.loginSSO(idToken, env);
    };

    switchEnvironment = async (envID: string): Promise<void> => {
        return this.authRepository.switchEnvironment(envID);
    };

    logout = async () => {
        return this.authRepository.logout();
    };

    loginEnvironments = async (name: string): Promise<BasicEntity[]> => {
        return this.authRepository.loginEnvironments(name);
    };

    adminEnvironments = async (): Promise<BasicEntity[]> => {
        return this.authRepository.adminEnvironments();
    };

    hasAdminUser = async (): Promise<boolean> => {
        return this.authRepository.hasAdminUser();
    };

    createLoggedInUser = async (
        userName: string,
        password: string,
        confirmedPassword: string,
        env: string,
    ): Promise<LoginResponse> => {
        return this.authRepository.createLoggedInUser(userName, password, confirmedPassword, env);
    };
}
