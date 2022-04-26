export default class AutomatedTask {
    public type = '';
    public status = '';
    public name = '';
    public failureReason?: string | null;
    public startTime = '';
    public disabled =  false;
    public duration = '';
    public uuid = '';

    isFinished(): boolean {
        return this.status === 'SUCCESS' || this.status === 'FAIL';
    }
}
