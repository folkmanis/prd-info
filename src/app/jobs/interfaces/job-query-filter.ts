import { ParamMap } from '@angular/router';
import { JobCategories } from './job-categories';

export interface JobFilter {
  start?: number;

  limit?: number;

  fromDate?: Date;

  customer?: string;

  name?: string;

  invoice?: 0 | 1;

  jobStatus?: number[];

  jobsId?: number[];

  productsName?: string;

  category?: JobCategories;
}

export function queryParamsToJobFilter(queryParams: ParamMap): JobFilter {
  const filter: JobFilter = {
    jobStatus: [10, 20],
  };

  if (queryParams.has('start')) {
    filter.start = +queryParams.get('start')!;
  }
  if (queryParams.has('limit')) {
    filter.limit = +queryParams.get('limit')!;
  }
  if (queryParams.has('fromDate')) {
    filter.fromDate = new Date(queryParams.get('fromDate')!);
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
    filter.jobStatus = jobStatus.map((n) => +n).filter((n) => !isNaN(n));
  }
  return filter;
}

export function jobFilterToRequestQuery(filter: JobFilter): Record<string, any> {
  return {
    ...filter,
    jobsId: filter.jobsId ? filter.jobsId.join(',') : undefined,
    jobStatus: filter.jobStatus ? filter.jobStatus.join(',') : undefined,
    fromDate: filter.fromDate ? new Date(filter.fromDate).toISOString() : undefined,
  };
}
