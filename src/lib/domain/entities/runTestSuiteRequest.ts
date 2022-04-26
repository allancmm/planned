import {immerable} from 'immer';

export class RunTestSuiteRequest {
    [immerable] = true;

    public tags?: string[] | null;

    constructor(tags?: string[] | null) {
        this.tags = tags || [];
    }
}
