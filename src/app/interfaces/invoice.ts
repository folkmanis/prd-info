import { Customer } from './customer';
import { JobPartial } from 'src/app/jobs';

export interface Invoice {
    invoiceId: string;
    customer: string;
    createdDate: Date;
    jobsId: number[];
    jobs?: JobPartial[];
    products: InvoiceProduct[];
    total?: number;
    comment?: string;
    customerInfo?: Customer;
    paytraq?: PaytraqInvoice;
}

export type InvoiceForReport = Pick<Invoice, 'invoiceId' | 'customer' | 'createdDate' | 'jobs' | 'products' | 'total' | 'customerInfo'>;

export const INVOICE_UPDATE_FIELDS = ['comment', 'paytraq'] as const;

export type InvoiceUpdate = Partial<Pick<Invoice, typeof INVOICE_UPDATE_FIELDS[number]>>;

export type InvoiceTable = Pick<Invoice, 'invoiceId' | 'customer' | 'createdDate'> & {
    totals: {
        count: number;
        sum: number;
    };
};

export interface PaytraqInvoice {
    paytraqId: number;
    documentRef?: string;
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
    comment?: string;
    paytraqId?: number;
}

export interface ProductTotals {
    _id: string;
    count: number;
    total: number;
}
