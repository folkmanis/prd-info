import { ParamMap } from '@angular/router';
import { JOB_CATEGORIES, JobCategories } from './job-categories';
import { z } from 'zod';

export const JobFilterSchema = z
  .object({
    fromDate: z.coerce.date(),
    toDate: z.coerce.date(),
    customer: z.string(),
    name: z.string(),
    invoice: z.union([z.literal(0), z.literal(1)]),
    jobStatus: z.array(z.number()),
    jobsId: z.array(z.number()),
    productsName: z.string(),
    category: JOB_CATEGORIES,
  })
  .partial();

export type JobFilter = z.infer<typeof JobFilterSchema>;

// export interface JobFilter {
//   fromDate?: Date;
//   toDate?: Date;
//   customer?: string;
//   name?: string;
//   invoice?: 0 | 1;
//   jobStatus?: number[];
//   jobsId?: number[];
//   productsName?: string;
//   category?: JobCategories;
// }

export function queryParamsToJobFilter(queryParams: ParamMap): JobFilter {
  const filter: JobFilter = {
    jobStatus: [10, 20],
  };

  if (queryParams.has('fromDate')) {
    filter.fromDate = new Date(queryParams.get('fromDate')!);
  }
  if (queryParams.has('toDate')) {
    filter.toDate = new Date(queryParams.get('toDate')!);
  }
  if (queryParams.has('customer')) {
    filter.customer = queryParams.get('customer')!;
  }
  if (queryParams.has('name')) {
    filter.name = queryParams.get('name')!;
  }
  if (queryParams.has('category')) {
    filter.category = queryParams.get('category') as JobCategories;
  }
  if (queryParams.has('jobsId')) {
    const jobsId = queryParams.getAll('jobsId');
    filter.jobsId = [jobsId].map((n) => +n).filter((n) => !isNaN(n));
  }
  if (queryParams.has('productsName')) {
    filter.productsName = queryParams.get('productsName')!;
  }
  if (queryParams.has('invoice')) {
    filter.invoice = queryParams.get('invoice') ? 1 : 0;
  }
  if (queryParams.has('jobStatus')) {
    const jobStatus = queryParams.getAll('jobStatus');
    filter.jobStatus = jobStatus
      .flatMap((n) => n.split(','))
      .map((n) => +n)
      .filter((n) => !isNaN(n));
  }
  return filter;
}

export function jobFilterToRequestQuery<T extends JobFilter | undefined>(filter: T): Record<string, any> | undefined {
  return filter
    ? {
        ...filter,
        jobsId: filter.jobsId ? filter.jobsId.join(',') : undefined,
        jobStatus: filter.jobStatus ? filter.jobStatus.join(',') : undefined,
        fromDate: filter.fromDate ? new Date(filter.fromDate).toISOString() : undefined,
        toDate: filter.toDate ? new Date(filter.toDate).toISOString() : undefined,
      }
    : undefined;
}
