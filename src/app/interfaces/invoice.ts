import { AppHttpResponseBase } from 'src/app/library/http/http-response-base';
import { Job } from './job';

export interface Invoice {
    invoiceId: string;
    customer: string;
    createdDate: Date;
    jobsId: number[];
    jobs?: Job[];
    products: InvoiceProduct[];
}

export interface InvoicesFilter {
    customer?: string;
}

export interface InvoiceProduct {
    _id: string;
    total: number;
    jobsCount: number;
    count: number;
    price?: number;
}

export interface InvoiceResponse extends AppHttpResponseBase {
    invoices?: Invoice[];
    invoice?: Invoice;
    totals?: ProductTotals[];
}

export interface ProductTotals {
    _id: string;
    count: number;
    total: number;
}
