import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { cacheable, httpFilter, httpResponseRequest, validateAsync, validatorFn } from 'src/app/library';
import { z } from 'zod';
import {
  Job,
  JobFilter,
  JobFilterSchema,
  JobPartial,
  JobsProduction,
  JobsProductionFilter,
  JobsProductionFilterSchema,
  JobsWithoutInvoicesTotals,
  JobUnwindedPartial,
} from '../interfaces';
import { JobsUserPreferences } from '../interfaces/jobs-user-preferences';

export const JobUpdateParamsSchema = z.object({
  createFolder: z.stringbool().optional(),
});
export type JobUpdateParams = z.infer<typeof JobUpdateParamsSchema>;

@Service()
export class JobsApiService {
  #path = getAppParams('apiPath') + 'jobs/';
  #http = inject(HttpClient);

  getAll(filter: JobFilter = {}): Promise<JobPartial[]> {
    filter.unwindProducts = false;
    const options = httpFilter(JobFilterSchema, filter);
    const response$ = this.#http.get(this.#path, options);
    return validateAsync(JobPartial.array(), response$);
  }

  getAllUnwinded(filter: JobFilter = {}): Promise<JobUnwindedPartial[]> {
    filter.unwindProducts = true;
    const options = httpFilter(JobFilterSchema, filter);
    const response$ = this.#http.get(this.#path, options);
    return validateAsync(JobUnwindedPartial.array(), response$);
  }

  getJobsCount(filter?: JobFilter): Observable<{ count: number }> {
    const options = httpFilter(JobFilterSchema, filter);
    const response$ = this.#http.get(this.#path + 'count', options);
    return response$.pipe(map(validatorFn(z.object({ count: z.number().nonnegative() }))));
  }

  jobsResource(filter: Signal<JobFilter | undefined>): HttpResourceRef<JobPartial[] | undefined> {
    return this.#jobsResource(filter, false, validatorFn(JobPartial.array()));
  }

  jobsUnwindedResource(filter: Signal<JobFilter | undefined>): HttpResourceRef<JobUnwindedPartial[] | undefined> {
    return this.#jobsResource(filter, true, validatorFn(JobUnwindedPartial.array()));
  }

  #jobsResource<P extends boolean, Result = P extends false ? JobPartial : JobUnwindedPartial>(
    filter: Signal<JobFilter | undefined>,
    unwindProducts: P,
    parse: (value: unknown) => Result[],
  ): HttpResourceRef<Result[] | undefined> {
    return httpResource(
      () => {
        const f = filter();
        if (!f) return;
        const options = httpFilter(JobFilterSchema, f).setParam('unwindProducts', unwindProducts ? '1' : '0');
        return httpResponseRequest(this.#path, options);
      },
      {
        equal: isEqual,
        parse,
      },
    );
  }

  async updateMany(jobs: Partial<Job>[], params?: JobUpdateParams): Promise<number> {
    const options = httpFilter(JobUpdateParamsSchema, params);
    const response = await firstValueFrom(this.#http.patch<{ count: number }>(this.#path, jobs, options));
    return response.count;
  }

  getOne(jobId: number) {
    const data$ = this.#http.get(this.#path + jobId);
    return validateAsync(Job, data$);
  }

  insertOne(job: Partial<Job>, params: JobUpdateParams): Promise<Job> {
    const options = httpFilter(JobUpdateParamsSchema, params);
    const data$ = this.#http.put<Job>(this.#path, job, options);
    return validateAsync(Job, data$);
  }

  updateOne(jobId: number, job: Partial<Job>, params: JobUpdateParams): Promise<Job> {
    const options = httpFilter(JobUpdateParamsSchema, params);
    const data$ = this.#http.patch(this.#path + jobId, job, options);
    return validateAsync(Job, data$);
  }

  createFolder(jobId: number): Promise<Job> {
    const data$ = this.#http.patch<Job>(this.#path + jobId + '/createFolder', {});
    return validateAsync(Job, data$);
  }

  jobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.#http
      .get(this.#path + 'jobs-without-invoices-totals', cacheable())
      .pipe(map(validatorFn(JobsWithoutInvoicesTotals.array())));
  }

  getJobsProductionSummaryResource(
    filter: Signal<JobsProductionFilter | undefined>,
  ): HttpResourceRef<JobsProduction[] | undefined> {
    return httpResource(
      () => {
        const f = filter();
        if (!f) return;
        const params = httpFilter(JobsProductionFilterSchema, f);
        return httpResponseRequest(this.#path + 'products', params);
      },
      {
        parse: validatorFn(JobsProduction.array()),
        equal: isEqual,
      },
    );
  }

  jobsProductionSummary(filter: JobFilter): Observable<JobsProduction[]> {
    const params = httpFilter(JobFilterSchema, filter);
    const data$ = this.#http.get(this.#path + 'products', params);
    return data$.pipe(map(validatorFn(JobsProduction.array())));
  }

  getUserPreferences(): Promise<JobsUserPreferences> {
    const data$ = this.#http.get(this.#path + 'preferences');
    return validateAsync(JobsUserPreferences, data$);
  }

  setUserPreferences(preferences: JobsUserPreferences): Promise<JobsUserPreferences> {
    const data$ = this.#http.patch(this.#path + 'preferences', preferences);
    return validateAsync(JobsUserPreferences, data$);
  }
}
