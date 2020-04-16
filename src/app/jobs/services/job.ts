import { Product } from 'src/app/jobs-admin/products/services/product';
import { AppHttpResponseBase } from 'src/app/library/http/http-response-base';

export interface Job {
    _id: string;
    jobId: number;
    customer: string;
    name: string;
    customerJobId?: string;
    receivedDate: Date;
    invoice?: {
        id: string;
        date: Date;
    };
    products?: Pick<Product, 'name'> & {
        price: number;
        comment: string;
    }[];
}

export interface JobResponse extends AppHttpResponseBase {
    jobs?: Job[];
    job?: Job;
}

export interface JobQueryFilter {
    fromDate?: Date;
    customer?: string;
    name?: string;
}

export type JobUpdate = Pick<Job, 'jobId'> & Partial<Job>;
