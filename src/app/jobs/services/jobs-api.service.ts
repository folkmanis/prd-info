import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClassTransformer } from 'class-transformer';
import { pickBy } from 'lodash-es';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { HttpOptions } from 'src/app/library/http';
import { Job, JobPartial, JobQueryFilter, JobsProduction, JobsProductionQuery, JobsWithoutInvoicesTotals, JobUnwindedPartial } from '../interfaces';
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

  constructor(
    private http: HttpClient,
    private transformer: ClassTransformer,
  ) {}

  getAll(filter: JobQueryFilter, unwind: true): Observable<JobUnwindedPartial[]>;
  getAll(filter: JobQueryFilter, unwind: false): Observable<JobPartial[]>;
  getAll(filter: JobQueryFilter, unwind: boolean = false) {
    filter.unwindProducts = unwind ? 1 : 0;
    return this.http.get(this.path, new HttpOptions(filter));
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
