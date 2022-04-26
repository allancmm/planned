import JobRepository from '../../domain/repositories/jobRepository';
import LongJob from '../../domain/util/longJob';
import { ApiGateway } from '../config/apiGateway';

export default class JobApiRepository implements JobRepository {
    constructor(private api: ApiGateway) {}

    async getJobStatus (jobId: string): Promise<LongJob> {
        return this.api.get(`jobs/${jobId}`, { outType: LongJob });
    }
}
