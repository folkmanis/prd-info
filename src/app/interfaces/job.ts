import { KastesJob } from './kastes-job';
import { ReproJob } from './repro-job';
import { AppHttpResponseBase } from 'src/app/library/http';

export type Job = ReproJob | KastesJob;

export type JobPartial =
    Pick<Job, 'category' | 'receivedDate' | 'customerJobId' | 'name' | 'jobId' | 'customer' | 'products' | 'invoiceId' | 'custCode' | 'dueDate'>;

export interface JobsWithoutInvoicesTotals {
    _id: string;
    jobs: number;
    totals: number;
}

export interface JobResponse extends AppHttpResponseBase<Job> {
    jobsWithoutInvoicesTotals?: JobsWithoutInvoicesTotals[];
}

export interface JobQueryFilter {
    fromDate?: Date;
    customer?: string;
    name?: string;
    category?: 'perforated paper' | 'repro';
    invoice?: 0 | 1;
    jobsId?: number | number[];
    jobStatus?: number | number[];
    unwindProducts?: 0 | 1;
}

export type JobUpdate = Pick<Job, 'jobId'> & Partial<Job>;
