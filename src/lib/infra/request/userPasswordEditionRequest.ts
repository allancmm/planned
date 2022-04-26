import {immerable} from "immer";

export class UserPasswordEditionRequest {
    [ immerable ] = true;

    public currentPassword: string = '';
    public newPassword: string = '';
    public confirmPassword: string = '';
}