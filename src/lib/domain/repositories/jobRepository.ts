import LongJob from '../util/longJob';

export default interface JobRepository {
    getJobStatus(jobId: string): Promise<LongJob>;
}
