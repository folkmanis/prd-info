import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from 'src/app/library/http/http-options';
import { Observable, merge, Subject, BehaviorSubject, EMPTY, of, observable } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay } from 'rxjs/operators';

import { JobService } from './job.service';
import { Invoice, InvoiceResponse, JobPartial, JobQueryFilter } from '../interfaces';

@Injectable()
export class InvoicesService {
  private readonly httpPath = '/data/invoices/';
  readonly filter$ = new Subject<JobQueryFilter>();

  constructor(
    private http: HttpClient,
    private jobService: JobService,
  ) { }

  jobs$: Observable<JobPartial[]> = this.filter$.pipe(
    switchMap(f => this.jobService.getJobList(f)),
    share(),
  );

  createInvoice(params: { selectedJobs: number[], customerId: string; }): Observable<string> {
    return this.http.post<InvoiceResponse>(this.httpPath, params, new HttpOptions()).pipe(
      tap(resp => console.log(resp)),
      pluck('insertedId')
    );
  }

}
