import { Job, JobProduct } from 'src/app/jobs';
import { z } from 'zod';
import { isoDateToDate } from '../library/validator';
import { CustomerSchema } from './customer';

export const InvoiceJobSchema = Job.pick({
  jobId: true,
  name: true,
}).extend({
  products: JobProduct.optional(),
  receivedDate: isoDateToDate,
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
  createdDate: isoDateToDate,
  jobsId: z.array(z.number()),
  jobs: z.array(InvoiceJobSchema).optional(),
  products: z.array(InvoiceProductSchema),
  total: z.number().nullish(),
  comment: z.string().nullish(),
  paytraq: PaytraqInvoiceSchema.nullish(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

export const InvoiceForReportSchema = InvoiceSchema.pick({
  invoiceId: true,
  customer: true,
  createdDate: true,
  products: true,
  paytraq: true,
  comment: true,
}).extend({
  total: z.number(),
  customerInfo: CustomerSchema.omit({ customerName: true }).extend({ customerName: z.string() }).nullish(),
  jobs: z.array(InvoiceJobSchema).optional(),
});
export type InvoiceForReport = z.infer<typeof InvoiceForReportSchema>;

export const InvoiceCreateSchema = z.object({
  jobIds: z.array(z.number()),
  customerId: z.string(),
  detailedJobs: z.boolean().default(false),
});
export type InvoiceCreate = z.infer<typeof InvoiceCreateSchema>;

export const InvoiceUpdateSchema = InvoiceSchema.pick({
  comment: true,
  paytraq: true,
}).partial();
export type InvoiceUpdate = z.infer<typeof InvoiceUpdateSchema>;

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

export interface ProductTotals {
  _id: string;
  count: number;
  total: number;
  units: string;
}
