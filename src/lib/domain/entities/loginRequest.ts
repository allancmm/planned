export default class LoginRequest {
    public username: string = '';
    public password: string = '';
    public loginEnvironmentId: string = '';
}

export class LoginSSORequest {
    public idToken: string = '';
    public loginEnvironmentId: string = '';
}
