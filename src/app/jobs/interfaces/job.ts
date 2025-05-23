import { JobProductionStage } from 'src/app/interfaces';
import { z } from 'zod';
import { JOB_CATEGORIES, KastesProduction } from './job-categories';
import { JobProduct } from './job-product';

export const JobStatus = z.object({
  generalStatus: z.number(),
  timestamp: z.coerce.date(),
});
export type JobStatus = z.infer<typeof JobStatus>;

export const Files = z.object({
  path: z.array(z.string()),
  fileNames: z.array(z.string()).optional(),
});
export type Files = z.infer<typeof Files>;

export const Job = z.object({
  _id: z.string().optional(),
  _v: z.number().optional(),
  jobId: z.number(),
  customer: z.string(),
  name: z.string(),
  customerJobId: z.string().nullish(),
  receivedDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  comment: z.string().nullish(),
  invoiceId: z.string().nullish(),
  products: JobProduct.array()
    .nullish()
    .transform((val) => val ?? []),
  jobStatus: JobStatus,
  files: Files.nullish(),
  production: z.object({
    category: JOB_CATEGORIES,
  }),
  productionStages: JobProductionStage.array().nullish(),
});
export type Job = z.infer<typeof Job>;

export const KastesJob = Job.extend({
  production: KastesProduction,
});
export type KastesJob = z.infer<typeof KastesJob>;

export const JobPartial = Job.pick({
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
  production: z.object({
    category: JOB_CATEGORIES,
  }),
  custCode: z.string(),
});
export type JobPartial = z.infer<typeof JobPartial>;

export const JobsWithoutInvoicesTotals = z.object({
  _id: z.string(),
  jobs: z.number(),
  totals: z.number(),
  noPrice: z.number(),
});
export type JobsWithoutInvoicesTotals = z.infer<typeof JobsWithoutInvoicesTotals>;
