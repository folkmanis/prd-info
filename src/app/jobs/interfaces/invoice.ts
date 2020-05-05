import { AppHttpResponseBase } from 'src/app/library/http/http-response-base';

export interface Invoice {
    invoiceId: string;
    customer: string;
    createdDate: Date;
    jobs: number[];
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
