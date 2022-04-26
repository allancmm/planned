import { useScrollableTextArea } from 'equisoft-design-ui-elements';
import React, { useEffect, useState } from 'react';
import { defaultJobService } from '../../../lib/context';
import { JobStatus } from '../../../lib/domain/enums/jobStatus';
import LongJob from '../../../lib/domain/util/longJob';
import { LogJobContainer } from './style';

const withLongJob = (
    onJobEnd?: () => void,
): [boolean, LongJob, React.ReactNode, (action: () => Promise<LongJob>) => void, boolean] => {
    const [isPolling, setIsPolling] = useState(false);
    const [job, setJob] = useState(new LongJob());
    const [ref] = useScrollableTextArea(job.log);
    const [jobCalled, setJobCalled] = useState(false);

    useEffect(() => {
        let interval: any;
        if (isPolling) {
            interval = setInterval(() => fetchJobStatus(job.jobID), 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isPolling, job]);

    const startPollingWithAction = async (action: () => Promise<LongJob>) => {
        setJobCalled(true);
        const newJob = await action();
        setJob(newJob);
        setIsPolling(true);
        setJobCalled(false);
    };

    const fetchJobStatus = async (jobID: string) => {
        if (jobID) {
            try {
                const longJob = await defaultJobService.getJobStatus(jobID);
                const jobStatus = longJob.status as JobStatus;
                if (jobStatus === 'COMPLETED' || jobStatus === 'FAILED' || jobStatus === 'WARNINGS') {
                    setIsPolling(false);
                    onJobEnd?.();
                }
                setJob(longJob);
            } catch (e) {
                setIsPolling(false);
            }
        }
    };

    const displayJobLog: React.ReactNode = (
        <LogJobContainer>
            {job.log && <textarea ref={ref} readOnly value={job.log} />}
            {job.status && <p>{job.status}</p>}
        </LogJobContainer>
    );

    return [isPolling, job, displayJobLog, startPollingWithAction, jobCalled];
};

export default withLongJob;
