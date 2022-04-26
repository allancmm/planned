import { Type } from 'class-transformer';
import AutomatedTask from './automatedTask';
import AutomatedTestLogResult from "./automatedTestLogResult";

export default class AutomatedTestResult {
    runningId = '';
    status = '';

    @Type(() => AutomatedTask)
    tasks: AutomatedTask[] = [];

    @Type(() => AutomatedTestLogResult )
    log = new AutomatedTestLogResult();

    isRunning(): boolean {
        return this.status === 'IN_PROGRESS' || this.status === 'STANDBY';
    }

    isFinished(): boolean {
        return this.status === 'SUCCESS' || this.status === 'FAIL';
    }
}
