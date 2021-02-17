import { AppHttpResponseBase } from 'src/app/library/http';
import { Job } from './job';
import { JobBase } from './job-base';
import { CustomerFinancial, Customer } from './customer';

export interface Invoice {
    invoiceId: string;
    customer: string;
    createdDate: Date;
    jobsId: number[];
    jobs?: JobBase[];
    products: InvoiceProduct[];
    total?: number;
    comment?: string;
    customerInfo?: Customer;
}

export type InvoiceForReport = Pick<Invoice, 'invoiceId' | 'customer' | 'createdDate' | 'jobs' | 'products' | 'total' | 'customerInfo'>;
// export type InvoiceLike = Partial<Invoice>;

export type InvoiceTable = Pick<Invoice, 'invoiceId' | 'customer' | 'createdDate'> & {
    totals: {
        count: number,
        sum: number,
    };
};

export interface InvoicesFilter {
    customer?: string;
}

export interface InvoiceProduct {
    _id: string;
    total: number;
    jobsCount: number;
    count: number;
    price?: number;
    comment?: string;
    paytraqId?: number;
}

export interface InvoiceResponse extends AppHttpResponseBase<Invoice> {
    totals?: ProductTotals[];
}

export interface ProductTotals {
    _id: string;
    count: number;
    total: number;
}
