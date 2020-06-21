import { Product } from './product';
import { AppHttpResponseBase } from 'src/app/library/http';

export interface Job {
    _id?: string;
    jobId: number;
    customer: string;
    name: string;
    customerJobId?: string;
    receivedDate: Date;
    comment?: string;
    invoiceId?: string;
    products?: JobProduct[] | JobProduct;
    productsIdx?: number;
    jobStatus: {
        generalStatus: number;
    };
    custCode: string;
}
export type JobPartial =
    Pick<Job, 'receivedDate' | 'customerJobId' | 'name' | 'jobId' | 'customer' | 'products' | 'invoiceId' | 'custCode'>;

export interface JobResponse extends AppHttpResponseBase<Job> {
    // jobs?: JobPartial[];
    // job?: Job;
}

export type JobProduct = Pick<Product, 'name'> & {
    price: number;
    count: number;
    comment?: string;
};

export interface JobQueryFilter {
    fromDate?: Date;
    customer?: string;
    name?: string;
    invoice?: 0 | 1;
    jobsId?: number | number[];
    jobStatus?: number | number[];
    unwindProducts?: 0 | 1;
}

export type JobUpdate = Pick<Job, 'jobId'> & Partial<Job>;
