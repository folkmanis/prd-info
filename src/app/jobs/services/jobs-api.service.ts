import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { isEqual, pickBy } from 'lodash-es';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';
import { Job, JobPartial, JobQueryFilter, JobQueryFilterOptions, JobsProduction, JobsProductionQuery, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
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
  private path = getAppParams('apiPath') + 'jobs/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  getAll(filter: JobQueryFilter, unwind: true): Promise<JobUnwindedPartial[]>;
  getAll(filter: JobQueryFilter, unwind: false): Promise<JobPartial[]>;
  getAll(filter: JobQueryFilter, unwind: boolean = false) {
    const response$ = this.http.get(this.path, new HttpOptions({ ...filter, unwindProducts: unwind ? 1 : 0 }));
    return firstValueFrom(response$);
  }

  jobsResource(filter: Signal<Partial<JobQueryFilterOptions>>): HttpResourceRef<JobPartial[]> {
    return this.#jobsResource(filter, 0);
  }

  jobsUnwindedResource(filter: Signal<Partial<JobQueryFilterOptions>>): HttpResourceRef<JobUnwindedPartial[]> {
    return this.#jobsResource(filter, 1);
  }

  #jobsResource<P extends 0 | 1>(filter: Signal<Partial<JobQueryFilterOptions>>, unwindProducts: P): HttpResourceRef<P extends 0 ? JobPartial[] : JobUnwindedPartial[]> {
    const params = computed(() => ({
      ...filter(),
      unwindProducts,
    }));
    return httpResource(() => httpResponseRequest(this.path, new HttpOptions(params()).cacheable()), {
      defaultValue: [],
      equal: isEqual,
    });
  }

  async updateMany(jobs: Partial<Job>[], params?: JobUpdateParams): Promise<number> {
    const response = await firstValueFrom(this.http.patch<{ count: number }>(this.path, jobs, new HttpOptions(params)));
    return response.count;
  }

  getOne(jobId: number) {
    return this.http.get<Job>(this.path + jobId, new HttpOptions());
  }

  insertOne(job: Partial<Job>, params: JobUpdateParams) {
    return this.http.put<Job>(this.path, job, new HttpOptions(params));
  }

  updateOne(jobId: number, job: Partial<Job>, params: JobUpdateParams) {
    return this.http.patch<Job>(this.path + jobId, job, new HttpOptions(params));
  }

  createFolder(jobId: number): Observable<Job> {
    return this.http.patch<Job>(this.path + jobId + '/createFolder', {}, new HttpOptions());
  }

  jobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.http.get<JobsWithoutInvoicesTotals[]>(this.path + 'jobs-without-invoices-totals', new HttpOptions().cacheable());
  }

  getJobsProduction(query: JobsProductionQuery): Observable<JobsProduction[]> {
    const httpOptions = new HttpOptions(pickNotNull(query));
    return this.http.get<Record<string, any>[]>(this.path + 'products', httpOptions).pipe(map((data) => this.transformer.plainToInstance(JobsProduction, data)));
  }

  getUserPreferences(): Observable<JobsUserPreferences> {
    return this.http.get<JobsUserPreferences>(this.path + 'preferences', new HttpOptions());
  }

  setUserPreferences(preferences: JobsUserPreferences) {
    return this.http.patch<JobsUserPreferences>(this.path + 'preferences', preferences, new HttpOptions());
  }
}
