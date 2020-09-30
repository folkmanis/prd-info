import { JobProduct } from './job-product';

export interface JobBase {
    _id?: string;
    jobId: number;
    customer: string;
    name: string;
    customerJobId?: string;
    receivedDate: Date;
    dueDate: Date;
    category: 'repro' | 'perforated paper';
    comment?: string;
    invoiceId?: string;
    products?: JobProduct[] | JobProduct;
    productsIdx?: number;
    jobStatus: {
        generalStatus: number;
    };
    custCode: string;
    files?: {
        path: string[];
        fileNames: string[];
    };
}
