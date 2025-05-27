import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { isEqual, pickBy } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { ValidatorService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';
import { Job, JobPartial, JobsProduction, JobsProductionQuery, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
import { JobsUserPreferences } from '../interfaces/jobs-user-preferences';

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

  getAllUnwinded(filter: Record<string, any>): Promise<JobUnwindedPartial[]> {
    const response$ = this.#http.get<Record<string, any>[]>(this.#path, new HttpOptions({ ...filter, unwindProducts: 1 }));
    return this.#validator.validateArrayAsync(JobUnwindedPartial, response$);
  }

  jobsResource(filter: Signal<Record<string, any>>): HttpResourceRef<JobPartial[] | undefined> {
    return this.#jobsResource(filter, 0, this.#validator.arrayValidatorFn(JobPartial));
  }

  jobsUnwindedResource(filter: Signal<Record<string, any>>): HttpResourceRef<JobUnwindedPartial[] | undefined> {
    return this.#jobsResource(filter, 1, this.#validator.arrayValidatorFn(JobUnwindedPartial));
  }

  #jobsResource<P extends 0 | 1, Result = P extends 0 ? JobPartial : JobUnwindedPartial>(
    filter: Signal<Record<string, any>>,
    unwindProducts: P,
    parse: (value: Record<string, any>[]) => Result[],
  ): HttpResourceRef<Result[] | undefined> {
    const params = computed(() => ({
      ...filter(),
      unwindProducts,
    }));
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(params()).cacheable()), {
      equal: isEqual,
      parse,
    });
  }

  async updateMany(jobs: Partial<Job>[], params?: JobUpdateParams): Promise<number> {
    const response = await firstValueFrom(this.#http.patch<{ count: number }>(this.#path, jobs, new HttpOptions(params)));
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
    const data$ = this.#http.get<Record<string, any>[]>(this.#path + 'jobs-without-invoices-totals', new HttpOptions().cacheable());
    return this.#validator.validateArrayAsync(JobsWithoutInvoicesTotals, data$);
  }

  getJobsProduction(query: JobsProductionQuery): Promise<JobsProduction[]> {
    const httpOptions = new HttpOptions(pickNotNull(query));
    const data$ = this.#http.get<Record<string, any>[]>(this.#path + 'products', httpOptions);
    return this.#validator.validateArrayAsync(JobsProduction, data$);
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
