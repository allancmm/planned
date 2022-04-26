import { Type } from 'class-transformer';
import { immerable } from 'immer';
import AppSettings from './appSettings';
import Environment from './environment';
import SSOConfiguration from './ssoConfiguration';
import UserSettings from './userSettings';


export type LoginType = 'SIMPLE' | 'LDAP' | 'SSO';
export type AppFunctionTypes =
    | 'GIT_VIEW'
    | 'GIT_DEPLOY'
    | 'GIT_BUILD'
    | 'GIT_COMMIT'
    | 'GIT_PUSH'
    | 'TOOLS_OIPA_SECURITY_GROUP_IMPORT'
    | 'TOOLS_OIPA_SECURITY_GROUP_EXPORT'
    | 'ENTITIES_OIPA_USER'
    | 'ADMINISTRATION_VIEW'
    | 'SQL_QUERY_VIEW'


export default class AuthData {
    [immerable] = true;

    public loginType: LoginType = 'SIMPLE';
    public versionControlType: string = '';
    public designVersion: string = '';
    public oipaVersion: string = '';
    public environment: string = '';
    @Type(() => Environment) public oipaEnvironment: Environment | null = null;
    public userName: string = '';
    public appFunctions: AppFunctionTypes[] = [];
    @Type(() => AppSettings) public appSettings: AppSettings = new AppSettings();
    @Type(() => UserSettings) public userSettings: UserSettings = new UserSettings();
    @Type(() => SSOConfiguration) public ssoConfig?: SSOConfiguration;

    sameAs(o: AuthData): boolean {
        return (
            this.userName === o.userName &&
            this.oipaEnvironment?.identifier === o.oipaEnvironment?.identifier &&
            this.environment === o.environment
        );
    }

    appFunctionDisabled(appFunctions: AppFunctionTypes[]) : boolean {
        return !appFunctions.every(appFunction => this.appFunctions.includes(appFunction))
    };
}
