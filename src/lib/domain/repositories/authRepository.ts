import AuthData from '../entities/authData';
import BasicEntity from '../entities/basicEntity';
import LoginResponse from '../entities/loginResponse';
import UserSettings from '../entities/userSettings';

export default interface AuthRepository {
    setDisconnectHandler(onDisconnect: () => void): void;
    getAuthData(): Promise<AuthData>;
    updateUserSettings(userSettings: UserSettings): Promise<void>;
    login(userName: string, password: string, env: string): Promise<LoginResponse>;
    loginSSO(idToken: string, env: string): Promise<LoginResponse>;
    switchEnvironment(envID: string): Promise<void>;
    loginEnvironments(name: string): Promise<BasicEntity[]>;
    adminEnvironments(): Promise<BasicEntity[]>;
    logout(): Promise<void>;
    hasAdminUser(): Promise<boolean>;
    createLoggedInUser(
        userName: string,
        password: string,
        confirmedPassword: string,
        env: string,
    ): Promise<LoginResponse>;
}
