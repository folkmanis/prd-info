import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { isEqual, pickBy } from 'lodash-es';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { ValidatorService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';
import { Job, JobPartial, JobsProduction, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
import { JobsUserPreferences } from '../interfaces/jobs-user-preferences';
import { z } from 'zod';

export interface JobUpdateParams {
  createFolder?: boolean;
}

export function pickNotNull<T extends object>(obj: T): Partial<T> {
  return pickBy(obj, (val) => val !== undefined && val !== null);
}

@Injectable({
  providedIn: 'root',
})
export class JobsApiService {
  #path = getAppParams('apiPath') + 'jobs/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  getAll(filter: Record<string, any> = {}): Promise<JobPartial[]> {
    const response$ = this.#http.get<Record<string, any>[]>(
      this.#path,
      new HttpOptions({ ...filter, unwindProducts: 0 }),
    );
    return this.#validator.validateArrayAsync(JobPartial, response$);
  }

  getAllUnwinded(filter: Record<string, any>): Promise<JobUnwindedPartial[]> {
    const response$ = this.#http.get<Record<string, any>[]>(
      this.#path,
      new HttpOptions({ ...filter, unwindProducts: 1 }),
    );
    return this.#validator.validateArrayAsync(JobUnwindedPartial, response$);
  }

  getJobsCount(filter?: Record<string, any>): Observable<{ count: number }> {
    const response$ = this.#http.get<Record<string, any>[]>(this.#path + 'count', new HttpOptions(filter));
    return response$.pipe(map(this.#validator.validatorFn(z.object({ count: z.number().gte(0) }))));
  }

  jobsResource(filter: Signal<Record<string, any> | undefined>): HttpResourceRef<JobPartial[] | undefined> {
    return this.#jobsResource(filter, 0, this.#validator.arrayValidatorFn(JobPartial));
  }

  jobsUnwindedResource(
    filter: Signal<Record<string, any> | undefined>,
  ): HttpResourceRef<JobUnwindedPartial[] | undefined> {
    return this.#jobsResource(filter, 1, this.#validator.arrayValidatorFn(JobUnwindedPartial));
  }

  #jobsResource<P extends 0 | 1, Result = P extends 0 ? JobPartial : JobUnwindedPartial>(
    filter: Signal<Record<string, any> | undefined>,
    unwindProducts: P,
    parse: (value: any) => Result[],
  ): HttpResourceRef<Result[] | undefined> {
    const params = computed(() =>
      filter()
        ? {
            ...filter(),
            unwindProducts,
          }
        : undefined,
    );
    return httpResource(
      () => (params() ? httpResponseRequest(this.#path, new HttpOptions(params()).cacheable()) : undefined),
      {
        equal: isEqual,
        parse,
      },
    );
  }

  async updateMany(jobs: Partial<Job>[], params?: JobUpdateParams): Promise<number> {
    const response = await firstValueFrom(
      this.#http.patch<{ count: number }>(this.#path, jobs, new HttpOptions(params)),
    );
    return response.count;
  }

  getOne(jobId: number) {
    const data$ = this.#http.get(this.#path + jobId, new HttpOptions());
    return this.#validator.validateAsync(Job, data$);
  }

  insertOne(job: Partial<Job>, params: JobUpdateParams): Promise<Job> {
    const data$ = this.#http.put<Job>(this.#path, job, new HttpOptions(params));
    return this.#validator.validateAsync(Job, data$);
  }

  updateOne(jobId: number, job: Partial<Job>, params: JobUpdateParams): Promise<Job> {
    const data$ = this.#http.patch(this.#path + jobId, job, new HttpOptions(params));
    return this.#validator.validateAsync(Job, data$);
  }

  createFolder(jobId: number): Promise<Job> {
    const data$ = this.#http.patch<Job>(this.#path + jobId + '/createFolder', {}, new HttpOptions());
    return this.#validator.validateAsync(Job, data$);
  }

  jobsWithoutInvoicesTotals(): Promise<JobsWithoutInvoicesTotals[]> {
    const data$ = this.#http.get<Record<string, any>[]>(
      this.#path + 'jobs-without-invoices-totals',
      new HttpOptions().cacheable(),
    );
    return this.#validator.validateArrayAsync(JobsWithoutInvoicesTotals, data$);
  }

  getJobsProductionSummaryResource(query: Signal<Record<string, any> | undefined>) {
    return httpResource(
      () => (query() ? httpResponseRequest(this.#path + 'products', new HttpOptions(query())) : undefined),
      {
        parse: this.#validator.arrayValidatorFn(JobsProduction),
        equal: isEqual,
      },
    );
  }

  jobsProductionSummary(query: Record<string, any>): Observable<JobsProduction[]> {
    const data$ = this.#http.get(this.#path + 'products', new HttpOptions(query));
    return data$.pipe(map(this.#validator.arrayValidatorFn(JobsProduction)));
  }

  getUserPreferences(): Promise<JobsUserPreferences> {
    const data$ = this.#http.get(this.#path + 'preferences', new HttpOptions());
    return this.#validator.validateAsync(JobsUserPreferences, data$);
  }

  setUserPreferences(preferences: JobsUserPreferences): Promise<JobsUserPreferences> {
    const data$ = this.#http.patch(this.#path + 'preferences', preferences, new HttpOptions());
    return this.#validator.validateAsync(JobsUserPreferences, data$);
  }
}
