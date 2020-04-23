import { Product } from 'src/app/jobs-admin/products/services/product';
import { AppHttpResponseBase } from 'src/app/library/http/http-response-base';

export interface Job {
    _id: string;
    jobId: number;
    customer: string;
    name: string;
    customerJobId?: string;
    receivedDate: Date;
    comment?: string;
    invoice?: {
        id: string;
        date: Date;
    };
    products?: JobProduct[];
}
export type JobPartial = Pick<Job, '_id' | 'receivedDate' | 'customerJobId' | 'name' | 'jobId' | 'customer'>;

export interface JobResponse extends AppHttpResponseBase {
    jobs?: JobPartial[];
    job?: Job;
}

export type JobProduct = Pick<Product, 'name'> & {
    price: number;
    count: number;
    comment: string;
};

export interface JobQueryFilter {
    fromDate?: Date;
    customer?: string;
    name?: string;
}

export type JobUpdate = Pick<Job, 'jobId'> & Partial<Job>;
