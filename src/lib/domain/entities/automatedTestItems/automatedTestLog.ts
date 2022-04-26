import { Type } from "class-transformer";
import Comment from "./comment";

export default class AutomatedTestLog {
    name = '';
    type = '';
    status : StatusLogType = '';
    start = new Date();
    end = new Date();
    elapsedTime = '';
    @Type(() => Comment)
    comments: Comment[] = [];
}

export type StatusLogType = 'SUCCESS' | 'FAIL' | 'SKIP' | 'IN_PROGRESS' | '';
