import { Injectable } from '@angular/core';
import { Observable, merge, Subject, BehaviorSubject, EMPTY, of, observable } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay } from 'rxjs/operators';
import { PrdApiService } from 'src/app/services';

import { JobService } from './job.service';
import {
  JobPartial, JobQueryFilter,
  Invoice, InvoicesFilter,
  ProductTotals
} from 'src/app/interfaces';

@Injectable()
export class InvoicesService {
  jobFilter$ = new Subject<JobQueryFilter>();
  totalsFilter$ = new Subject<number[]>();

  constructor(
    private prdApi: PrdApiService,
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
    return this.prdApi.invoices.createInvoice(params);
  }

  getInvoice(invoiceId: string): Observable<Invoice> {
    return this.prdApi.invoices.get(invoiceId);
  }

  private getTotalsHttp(jobsId: number[]): Observable<ProductTotals[]> {
    return this.prdApi.invoices.getTotals(jobsId);
  }

  getInvoicesHttp(params: InvoicesFilter): Observable<Invoice[]> {
    return this.prdApi.invoices.get(params);
  }

}
