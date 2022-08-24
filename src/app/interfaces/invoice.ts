import { Type, Expose } from 'class-transformer';
import { Customer } from './customer';
import { JobPartial } from 'src/app/jobs';

export class InvoiceProduct {
    _id: string;
    total: number;
    jobsCount: number;
    count: number;
    price?: number;
    comment?: string;
    paytraqId?: number;
}

export class PaytraqInvoice {
    paytraqId: number;
    documentRef?: string;
}

export class Invoice {

    invoiceId: string;

    customer: string;

    @Type(() => Date)
    createdDate: Date;

    jobsId: number[];

    jobs?: JobPartial[];

    @Type(() => InvoiceProduct)
    products: InvoiceProduct[];

    total?: number;

    comment?: string;

    @Type(() => Customer)
    customerInfo?: Customer;

    @Type(() => PaytraqInvoice)
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

export interface InvoicesFilter {
    customer?: string;
}


export class ProductTotals {
    _id: string;
    count: number;
    total: number;
}
