import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from 'src/app/library/http/http-options';
import { Observable, merge, Subject, BehaviorSubject, EMPTY, of, observable } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay } from 'rxjs/operators';

import { JobService } from './job.service';
import { Invoice, InvoiceResponse, JobPartial, JobQueryFilter, ProductTotals, InvoicesFilter } from '../interfaces';

@Injectable()
export class InvoicesService {
  private readonly httpPath = '/data/invoices/';
  jobFilter$ = new Subject<JobQueryFilter>();
  totalsFilter$ = new Subject<number[]>();

  constructor(
    private http: HttpClient,
    private jobService: JobService,
  ) { }

  jobs$: Observable<JobPartial[]> = this.jobFilter$.pipe(
    switchMap(f => this.jobService.getJobList(f)),
    share(),
  );

  totals$: Observable<ProductTotals[]> = this.totalsFilter$.pipe(
    switchMap(f => this.getTotalsHttp(f)),
    share(),
  );

  createInvoice(params: { selectedJobs: number[], customerId: string; }): Observable<Invoice> {
    return this.http.post<InvoiceResponse>(this.httpPath, params, new HttpOptions()).pipe(
      tap(resp => console.log(resp)),
      pluck('invoice')
    );
  }

  getInvoice(invoiceId: string): Observable<Invoice> {
    return this.http.get<InvoiceResponse>(this.httpPath + invoiceId, new HttpOptions().cacheable()).pipe(
      pluck('invoice'),
    );
  }

  private getTotalsHttp(jobsId: number[]): Observable<ProductTotals[]> {
    return this.http.get<InvoiceResponse>(this.httpPath + 'totals', new HttpOptions({ jobsId })).pipe(
      pluck('totals'),
    );
  }

  getInvoicesHttp(params: InvoicesFilter): Observable<Invoice[]> {
    return this.http.get<InvoiceResponse>(this.httpPath, new HttpOptions(params).cacheable()).pipe(
      pluck('invoices')
    );
  }

  getInvoicePdf(invoiceId: string): Observable<Blob> {
    return this.http.get(this.httpPath + invoiceId + '/report', { responseType: 'blob' });
  }

}