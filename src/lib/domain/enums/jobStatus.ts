export type JobStatus =
    | 'CREATED'
    | 'INACTIVE'
    /* Job completed */
    | 'COMPLETED'
    | 'FAILED'
    | 'WARNINGS'
    /*Job about to running */
    | 'IN_PROGRESS'
    | 'WILL_FAIL';
