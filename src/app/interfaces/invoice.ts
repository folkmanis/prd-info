import { AppHttpResponseBase } from 'src/app/library/http';
import { Job } from './job';

export interface Invoice {
    invoiceId: string;
    customer: string;
    createdDate: Date;
    jobsId: number[];
    jobs?: Job[];
    products: InvoiceProduct[];
    total?: number;
    comment?: string;
}

export type InvoiceLike = Partial<Invoice> & {
    financial?: {
        clientName: string;
    };
};

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
}

export interface InvoiceResponse extends AppHttpResponseBase<Invoice> {
    totals?: ProductTotals[];
}

export interface ProductTotals {
    _id: string;
    count: number;
    total: number;
}
