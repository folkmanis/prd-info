import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiBase, HttpOptions } from 'src/app/library/http';
import { Job, JobsWithoutInvoicesTotals } from '../interfaces';
import { Observable } from 'rxjs';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';
import { ClassTransformer } from 'class-transformer';

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
      this.path + jobId + '/file',
      form,
      { reportProgress: true, }
    );
    return this.http.request<Job>(request);
  }


}
