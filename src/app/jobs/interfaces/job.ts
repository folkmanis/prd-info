import { ObjectId } from 'mongodb';
import { Production, JOB_CATEGORIES, JobCategories, ReproProduction, KastesProduction, PrintProduction, ProductionCategory } from './job-categories';
import { JobProduct } from './job-product';


export interface JobStatus {
    generalStatus: number;
    timestamp: Date;
}

export interface Files {
    path: string[];
    fileNames?: string[];
}

export interface Job {

    _id: ObjectId;
    _v: 2;
    jobId: number;
    customer: string;
    name: string;
    customerJobId?: string;
    receivedDate: Date;
    dueDate: Date;
    comment?: string;
    invoiceId?: string;
    products: JobProduct[];
    jobStatus: JobStatus;
    files?: Files;

    production?: ReproProduction | KastesProduction | PrintProduction;

}

export interface KastesJob extends Job {
    production: KastesProduction;
}

export interface ReproJob extends Job {
    production: ReproProduction;
}

export interface PrintJob extends Job {
    production: PrintProduction;
}


export type JobPartial = Pick<Job,
    'jobId' | 'customer' | 'name' | 'customerJobId' | 'receivedDate' | 'dueDate' | 'products' | 'invoiceId' | 'jobStatus'
> & {
    custCode: string;
    production: Pick<Production, 'category'>;
};

export interface JobsWithoutInvoicesTotals {
    _id: string;
    jobs: number;
    totals: number;
    noPrice: number;
}

