import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiBase, HttpOptions } from 'src/app/library/http';
import { Job, JobsWithoutInvoicesTotals, JobsProductionFilterQuery, JobsProduction, JobsProductionQuery } from '../interfaces';
import { map, Observable } from 'rxjs';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';
import { ClassTransformer } from 'class-transformer';
import { Dictionary, pickBy } from 'lodash';
import { JobsUserPreferences } from '../interfaces/jobs-user-preferences';

export function pickNotNull<T>(obj: Dictionary<T>): Dictionary<T> {
  return pickBy(obj, val => val !== undefined && val !== null);
}


@Injectable({
  providedIn: 'root'
})
export class JobsApiService extends ApiBase<Job> {

  constructor(
    @Inject(APP_PARAMS) params: AppParams,
    http: HttpClient,
    private transformer: ClassTransformer,
  ) {
    super(http, params.apiPath + 'jobs/');
  }

  jobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.http.get<JobsWithoutInvoicesTotals[]>(this.path + 'jobs-without-invoices-totals', new HttpOptions().cacheable());
  }

  createFolder(jobId: number): Observable<Job> {
    return this.http.patch<Job>(this.path + jobId + '/createFolder', {}, new HttpOptions());
  }

  fileUpload(jobId: number, form: FormData): Observable<HttpEvent<Job>> {
    const request = new HttpRequest(
      'PUT',
      this.path + 'files/' + jobId + '/upload',
      form,
      { reportProgress: true, }
    );
    return this.http.request<Job>(request);
  }

  getJobsProduction(query: JobsProductionQuery): Observable<JobsProduction[]> {
    const httpOptions = new HttpOptions(
      pickNotNull(query)
    );
    return this.http.get<Record<string, any>[]>(this.path + 'products', httpOptions).pipe(
      map(data => this.transformer.plainToInstance(JobsProduction, data)),
    );
  }

  getUserPreferences(): Observable<JobsUserPreferences> {
    return this.http.get<Record<string, any>>(this.path + 'preferences', new HttpOptions()).pipe(
      map(data => this.transformer.plainToInstance(JobsUserPreferences, data, { excludeExtraneousValues: true })),
    );
  }

  setUserPreferences(preferences: JobsUserPreferences) {
    const data = this.transformer.instanceToPlain(preferences);
    return this.http.patch<Record<string, any>>(this.path + 'preferences', data, new HttpOptions()).pipe(
      map(data => this.transformer.plainToInstance(JobsUserPreferences, data, { excludeExtraneousValues: true })),
    );
  }


}
