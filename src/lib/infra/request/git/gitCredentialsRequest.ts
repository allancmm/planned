import {immerable} from 'immer';

export default class GitCredentialsRequest {
    [immerable] = true;

    public username: string = '';
    public password: string = '';
}
