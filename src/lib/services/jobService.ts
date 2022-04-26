import JobRepository from '../domain/repositories/jobRepository';
import LongJob from '../domain/util/longJob';

export default class JobService {
    constructor(private jobRepository: JobRepository) {}

    getJobStatus = async (jobId: string): Promise<LongJob> => {
        return this.jobRepository.getJobStatus(jobId);
    };
}
