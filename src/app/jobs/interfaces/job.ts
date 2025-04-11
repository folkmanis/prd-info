import { KastesProduction, PrintProduction, Production, ReproProduction } from './job-categories';
import { JobProduct } from './job-product';
import { JobProductionStage } from 'src/app/interfaces';
import { z } from 'zod';

export interface JobStatus {
  generalStatus: number;
  timestamp: Date;
}

export interface Files {
  path: string[];
  fileNames?: string[];
}

export interface Job {
  _id?: string;
  _v?: number;
  jobId: number;
  customer: string;
  name: string;
  customerJobId?: string;
  receivedDate: Date;
  dueDate: Date;
  comment?: string;
  invoiceId?: string;
  products: JobProduct[];
  jobStatus: JobStatus;
  files?: Files;

  production: Production;

  productionStages?: JobProductionStage[];
}

export interface KastesJob extends Job {
  production: KastesProduction;
}

export interface ReproJob extends Job {
  production: ReproProduction;
}

export interface PrintJob extends Job {
  production: PrintProduction;
}

export type JobPartial = Pick<Job, 'jobId' | 'customer' | 'name' | 'customerJobId' | 'receivedDate' | 'dueDate' | 'products' | 'invoiceId' | 'jobStatus'> & {
  custCode: string;
  production: Pick<Production, 'category'>;
};

export const JobsWithoutInvoicesTotals = z.object({
  _id: z.string(),
  jobs: z.number(),
  totals: z.number(),
  noPrice: z.number(),
});

export type JobsWithoutInvoicesTotals = z.infer<typeof JobsWithoutInvoicesTotals>;
