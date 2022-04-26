import { OktaAuth } from '@okta/okta-auth-js';
import { DesignThemeProvider, Themes } from 'equisoft-design-ui-elements';
import produce from 'immer';
import localforage from 'localforage';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEY } from '../components/editor/tabs/tabContext';
import { defaultAuthService, defaultInteropService } from '../lib/context';
import AuthData from '../lib/domain/entities/authData';
import BasicEntity from '../lib/domain/entities/basicEntity';
import Environment from '../lib/domain/entities/environment';
import LoginResponse from '../lib/domain/entities/loginResponse';
import AuthService from '../lib/services/authService';
import InteropService from '../lib/services/interopService';

export interface AuthContextProps {
    auth: AuthData;
    isAuthenticated: AuthStatus;
    hasAdminUser: boolean;
    oktaAuth?: OktaAuth;
    loginEnvironments(name: string): Promise<BasicEntity[]>;
    adminEnvironments(): Promise<BasicEntity[]>;
    login(userName: string, password: string, env: string): Promise<LoginResponse>;
    loginSSO(idToken: string, env: string): Promise<LoginResponse>;
    createLoggedInUser(
        userName: string,
        password: string,
        confirmedPassword: string,
        env: string,
    ): Promise<LoginResponse>;
    logout(): Promise<void>;
    getContextPath(): string;
    switchEnv(eId: string): Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps>({
    auth: new AuthData(),
    isAuthenticated: 'NO',
    hasAdminUser: false,
    oktaAuth: undefined,
    loginEnvironments: () => Promise.resolve([]),
    adminEnvironments: () => Promise.resolve([]),
    login: () => Promise.resolve(new LoginResponse()),
    loginSSO: () => Promise.resolve(new LoginResponse()),
    createLoggedInUser: () => Promise.resolve(new LoginResponse()),
    logout: () => Promise.resolve(),
    getContextPath: () => '',
    switchEnv: () => Promise.resolve(),
});

export const hasAdminUser = (): boolean => {
    return useContext(AuthContext).hasAdminUser;
};

export const isAuthenticated = () => {
    return useContext(AuthContext).isAuthenticated;
};

export const useContextPath = () => {
    return useContext(AuthContext).getContextPath();
};

export const useLoginType = () => {
    return useContext(AuthContext).auth.loginType;
};

export const hasExternalLoginIntegration = (): boolean => {
    const loginType = useContext(AuthContext).auth.loginType;
    return loginType === 'SSO' || loginType === 'LDAP';
}

export const useAppSettings = () => {
    return useContext(AuthContext).auth.appSettings;
};

export const useCurrentEnvironment = () => {
    return useContext(AuthContext).auth.oipaEnvironment ?? new Environment();
};

export const useUsername = () => {
    return useContext(AuthContext).auth.userName;
};

export const useSSOConfig = () => {
    return useContext(AuthContext).auth.ssoConfig;
};
interface AuthProviderProps {
    authService: AuthService;
    interopService: InteropService;
}

export type AuthStatus = 'YES' | 'NO' | 'LOST';
const AuthProvider = ({ authService, interopService, ...props }: AuthProviderProps) => {
    const [auth, setAuth] = useState<AuthData>(new AuthData());
    const [isAuth, setIsAuth] = useState<AuthStatus>('NO');
    const [hasAdmin, setHasAdmin] = useState<boolean>(false);

    if (auth.loginType === 'SSO' && !auth.ssoConfig) {
        toast.error('Missing SSO config, cannot continue....');
        return null;
    }
    const oktaAuth = auth?.ssoConfig
        ? new OktaAuth({
              clientId: auth.ssoConfig.clientId,
              issuer: auth.ssoConfig.issuer,
              redirectUri: auth.ssoConfig.redirectUri,
              scopes: auth.ssoConfig.scopes,
              postLogoutRedirectUri: auth.ssoConfig.postLogoutRedirectUri,
          })
        : undefined;

    const handleDisconnect = useCallback(() => {
        setIsAuth('LOST');
    }, [setIsAuth]);
    authService.setDisconnectHandler(handleDisconnect);

    useEffect(() => {
        fetchAuthData();
        setHasAdminUser();
    }, []);

    const fetchAuthData = async () => {
        const authData = await authService.getAuthData();
        setAuth(authData);

        if (authData.userName) {
            setIsAuth('YES');
        }
    };

    const setHasAdminUser = async () => {
        setHasAdmin(await authService.hasAdminUser());
    };

    const login = async (userName: string, password: string, env: string): Promise<LoginResponse> => {
        return authService.login(userName, password, env).then(async (d) => {
            await fetchAuthData();
            setIsAuth('YES');
            await localforage.removeItem(LOCAL_STORAGE_KEY);
            return d;
        });
    };

    const loginSSO = async (idToken: string, env: string): Promise<LoginResponse> => {
        return authService.loginSSO(idToken, env).then(async (d) => {
            await fetchAuthData();
            setIsAuth('YES');
            await localforage.removeItem(LOCAL_STORAGE_KEY);
            return d;
        });
    };

    const switchEnv = async (envId: string) => {
        return authService.switchEnvironment(envId).then(async () => {
            await fetchAuthData();
            setIsAuth('YES');
            await localforage.removeItem(LOCAL_STORAGE_KEY);
            location.reload();
        });
    };

    const updateTheme = (theme: Themes) => {
        const newAuthData = produce(auth, (draft) => {
            draft.userSettings.theme = theme;
        });
        setAuth(newAuthData);
        authService.updateUserSettings(newAuthData.userSettings);
    };

    const createLoggedInUser = async (
        userName: string,
        password: string,
        confirmedPassword: string,
        env: string,
    ): Promise<LoginResponse> => {
        return authService.createLoggedInUser(userName, password, confirmedPassword, env).then(async (d) => {
            await fetchAuthData();
            setIsAuth('YES');
            setHasAdmin(false);
            await localforage.removeItem(LOCAL_STORAGE_KEY);
            return d;
        });
    };

    const logout = async () => {
        if (auth.loginType === 'SSO' && oktaAuth) {
            await oktaAuth.signOut();
            return;
        }
        return authService.logout().then(async (d) => {
            await fetchAuthData();
            setIsAuth('NO');
            await localforage.removeItem(LOCAL_STORAGE_KEY);
            return d;
        });
    };

    const loginEnvironments = async (name: string) => authService.loginEnvironments(name);

    const adminEnvironments = async () => authService.adminEnvironments();

    const getContextPath = () => interopService.getContextPath();

    const context: AuthContextProps = useMemo(
        () => ({
            auth,
            login,
            loginSSO,
            createLoggedInUser,
            logout,
            isAuthenticated: isAuth,
            loginEnvironments,
            adminEnvironments,
            getContextPath,
            hasAdminUser: hasAdmin,
            switchEnv,
            oktaAuth,
        }),
        [
            auth,
            login,
            loginSSO,
            createLoggedInUser,
            logout,
            loginEnvironments,
            adminEnvironments,
            getContextPath,
            switchEnv,
            oktaAuth,
        ],
    );

    return (
        <AuthContext.Provider value={context}>
            <DesignThemeProvider
                theme={(auth?.userSettings?.theme as Themes) ?? 'light'}
                onThemeChanged={updateTheme}
                {...props}
            />
        </AuthContext.Provider>
    );
};

AuthProvider.defaultProps = {
    authService: defaultAuthService,
    interopService: defaultInteropService,
};

export default AuthProvider;
