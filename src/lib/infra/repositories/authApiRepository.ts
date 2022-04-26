import AuthData from '../../domain/entities/authData';
import BasicEntity from '../../domain/entities/basicEntity';
import CreateUserRequest from '../../domain/entities/createUserRequest';
import LoginRequest, { LoginSSORequest } from '../../domain/entities/loginRequest';
import LoginResponse from '../../domain/entities/loginResponse';
import UserSettings from '../../domain/entities/userSettings';
import AuthRepository from '../../domain/repositories/authRepository';
import { ApiGateway } from '../config/apiGateway';

export default class AuthApiRepository implements AuthRepository {
    constructor(private api: ApiGateway) {}

    setDisconnectHandler(onDisconnect: () => void): void {
        this.api.setDisconnectHandler(onDisconnect);
    }

    async getAuthData(): Promise<AuthData> {
        return this.api.get('/', { outType: AuthData });
    }

    async updateUserSettings(userSettings: UserSettings): Promise<void> {
        return this.api.post('/', userSettings, { inType: UserSettings });
    }

    async login(username: string, password: string, env: string): Promise<LoginResponse> {
        const request: LoginRequest = { username, password, loginEnvironmentId: env };
        return this.api.post('/login', request, { inType: LoginRequest, outType: LoginResponse });
    }

    async loginSSO(idToken: string, env: string): Promise<LoginResponse> {
        const request: LoginSSORequest = { idToken, loginEnvironmentId: env };
        return this.api.post('/loginSSO', request, { inType: LoginSSORequest, outType: LoginResponse });
    }

    async switchEnvironment(envID: string): Promise<void> {
        return this.api.post(`/auth/environment/${envID}`);
    }

    async loginEnvironments(name: string): Promise<BasicEntity[]> {
        return this.api.getArray(`/login/environments?name=${name}`, { outType: BasicEntity });
    }

    async adminEnvironments(): Promise<BasicEntity[]> {
        return this.api.getArray(`/admin-user/environments`, { outType: BasicEntity });
    }

    async logout(): Promise<void> {
        return this.api.post('/logout', null);
    }

    async hasAdminUser(): Promise<boolean> {
        return this.api.get('/admin-user');
    }

    async createLoggedInUser(
        username: string,
        password: string,
        confirmedPassword: string,
        env: string,
    ): Promise<LoginResponse> {
        const request: CreateUserRequest = { username, password, confirmedPassword, loginEnvironmentId: env };
        return this.api.post('/admin-user/creation', request, { inType: CreateUserRequest, outType: LoginResponse });
    }
}
