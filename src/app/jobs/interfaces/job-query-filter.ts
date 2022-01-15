import { JobCategories } from './job-categories';

export interface JobQueryFilterOptions {

    start: number;
    limit: number;

    fromDate: Date;

    customer: string;

    name: string;

    invoice: 0 | 1;

    unwindProducts: 0 | 1;

    jobStatus: number[];

    jobsId: number[];

    category: JobCategories;

}

export type JobQueryFilter = Partial<JobQueryFilterOptions>;

export type JobFilterKeys = 'customer' | 'jobsId' | 'name' | 'jobStatus';

export interface JobFilter {
    customer: string;
    jobsId: string;
    name: string;
    jobStatus: number[];
}
