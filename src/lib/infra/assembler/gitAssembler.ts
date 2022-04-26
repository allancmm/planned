import {GitStageRequest} from '../request/git/gitStageRequest';
import {GitUnstageRequest} from '../request/git/gitUnstageRequest';


export const toGitStageRequest = (
    gitFiles: string[]
): GitStageRequest => {
    return {
        gitFiles
    };
};

export const toGitUnstageRequest = (
    gitFiles: string[]
): GitUnstageRequest => {
    return {
        gitFiles
    };
};

