import { JobCategories } from './job-categories';
import { Type, Transform } from 'class-transformer';

export interface JobQueryFilterOptions {

    start: number;
    limit: number;

    fromDate: Date;

    customer: string;

    name: string;

    invoice: 0 | 1;

    unwindProducts: 0 | 1;

    jobStatus: number[];

    jobsId: number[];

    category: JobCategories;

}

export class JobQueryFilter {

    start?: number;

    limit?: number;

    @Type(() => Date)
    fromDate?: Date;

    @Transform(({ value }) => value || undefined)
    customer?: string;

    @Transform(({ value }) => value || undefined)
    name?: string;

    invoice?: 0 | 1;

    @Type(() => Number)
    unwindProducts: 0 | 1 = 0;

    @Transform(({ value }) => (Array.isArray(value) ? value : [value]).map(n => +n))
    jobStatus?: number[];

    @Transform(({ value }) => value ? (Array.isArray(value) ? value : [value]).map(n => +n) : undefined)
    jobsId?: number[];

    @Transform(({ value }) => value || undefined)
    productsName?: string;

    category?: JobCategories;

    jobListFilter(): Partial<JobFilter> {
        return Object.keys(this)
            .filter(key => JOB_FILTER_KEYS.includes(key as JobFilterKeys))
            .reduce((obj, key) => {
                obj[key] = this[key];
                return obj;
            }, {});
    }

}

export const JOB_FILTER_KEYS = ['customer', 'jobsId', 'name', 'jobStatus', 'productsName'] as const;

export type JobFilterKeys = typeof JOB_FILTER_KEYS[number];

export interface JobFilter {
    customer: string;
    jobsId: string;
    name: string;
    productsName: string;
    jobStatus: number[];
}

export const DEFAULT_FILTER: JobFilter = {
    jobsId: null,
    name: null,
    customer: null,
    jobStatus: [10, 20],
    productsName: null,
};

