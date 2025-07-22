import { Job, JobProduct } from 'src/app/jobs';
import { z } from 'zod';
import { Customer } from './customer';

export const InvoiceJobSchema = Job.pick({
  jobId: true,
  customer: true,
  name: true,
  customerJobId: true,
  receivedDate: true,
  dueDate: true,
  products: true,
  invoiceId: true,
  jobStatus: true,
}).extend({
  products: JobProduct.optional(),
});

export const InvoiceProductSchema = z.object({
  _id: z.string(),
  total: z.number(),
  jobsCount: z.number(),
  count: z.number(),
  price: z.number().nullish(),
  comment: z.string().nullish(),
  paytraqId: z.number().nullish(),
});
export type InvoiceProduct = z.infer<typeof InvoiceProductSchema>;

export const PaytraqInvoiceSchema = z.object({
  paytraqId: z.number(),
  documentRef: z.string().nullish(),
});
export type PaytraqInvoice = z.infer<typeof PaytraqInvoiceSchema>;

export const InvoiceSchema = z.object({
  invoiceId: z.string(),

  customer: z.string(),

  createdDate: z.coerce.date(),

  jobsId: z.array(z.number()),

  jobs: z.array(InvoiceJobSchema).optional(),

  products: z.array(InvoiceProductSchema),

  total: z.number().nullish(),

  comment: z.string().nullish(),

  customerInfo: Customer.nullish(),

  paytraq: PaytraqInvoiceSchema.nullish(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

export type InvoiceForReport = Pick<Invoice, 'invoiceId' | 'customer' | 'createdDate' | 'jobs' | 'products' | 'total' | 'customerInfo'>;

export const INVOICE_UPDATE_FIELDS = ['comment', 'paytraq'] as const;

export type InvoiceUpdate = Partial<Pick<Invoice, (typeof INVOICE_UPDATE_FIELDS)[number]>>;

export const InvoiceTableSchema = InvoiceSchema.pick({
  invoiceId: true,
  customer: true,
  createdDate: true,
}).extend({
  totals: z.object({
    count: z.number(),
    sum: z.number(),
  }),
});
export type InvoiceTable = z.infer<typeof InvoiceTableSchema>;

export interface InvoicesFilter {
  customer?: string;
}

export class ProductTotals {
  _id: string;
  count: number;
  total: number;
  units: string;
}
