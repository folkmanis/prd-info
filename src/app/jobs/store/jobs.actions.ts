import { Job, JobPartial, JobQueryFilter } from 'src/app/interfaces';

export class RetrieveJobs {
    static readonly type = '[Component] Retrieve Jobs';
}

export class SetFilter {
    static readonly type = '[Component] SetFilter';
    constructor(public filter: JobQueryFilter) { }
}

export class GetJob {
    static readonly type = '[Job Editor] Retrieve Single Job';
    constructor(public jobId: number) { }
}

export class UpdateJob {
    static readonly type = '[Job Editor] Update Single Job';
    constructor(
        public jobId: number,
        public job: Job
    ) { }
}

export class NewJob {
    static readonly type = '[Job Editor] Create New Job';
    constructor(
        public job: Partial<Job>,
    ) {}
}
