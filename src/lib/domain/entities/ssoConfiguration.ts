import { immerable } from 'immer';

export default class SSOConfiguration {
    [immerable] = true;

    public baseUrl: string = '';
    public issuer: string = '';
    public clientId: string = '';
    public redirectUri: string = '';
    public scopes: string[] = [];
    public postLogoutRedirectUri: string = '';
}
