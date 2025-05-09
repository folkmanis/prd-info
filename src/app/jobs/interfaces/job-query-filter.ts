import { JobCategories } from './job-categories';
import { Type, Transform, instanceToPlain } from 'class-transformer';

export interface JobQueryFilterOptions {
  start?: number;
  limit?: number;

  fromDate?: Date;

  customer?: string;

  name?: string;

  invoice?: 0 | 1;

  unwindProducts?: 0 | 1;

  jobStatus?: number[];

  jobsId?: number[];

  category?: JobCategories;
}

export class JobQueryFilter implements JobQueryFilterOptions {
  start?: number;

  limit?: number;

  @Type(() => Date)
  fromDate?: Date;

  @Transform(({ value }) => value || undefined)
  customer?: string;

  @Transform(({ value }) => value || undefined)
  name?: string;

  invoice?: 0 | 1;

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]).map((n) => +n), { toClassOnly: true })
  jobStatus?: number[];

  @Transform(({ value }) => (value ? (Array.isArray(value) ? value : [value]).map((n) => +n) : undefined), { toClassOnly: true })
  @Transform(({ value }) => (Array.isArray(value) ? value.join(',') : undefined), { toPlainOnly: true })
  jobsId?: number[];

  @Transform(({ value }) => value || undefined)
  productsName?: string;

  category?: JobCategories;

  toPlain(): JobFilter {
    return instanceToPlain(this) as JobFilter;
  }

  static default(): JobQueryFilter {
    const filter = new JobQueryFilter();
    filter.jobStatus = [10, 20];
    return filter;
  }
}

export const JOB_FILTER_KEYS = ['customer', 'jobsId', 'name', 'jobStatus', 'productsName'] as const;

export type JobFilterKeys = (typeof JOB_FILTER_KEYS)[number];

export interface JobFilter {
  customer: string;
  jobsId: string;
  name: string;
  productsName: string;
  jobStatus: number[];
}
