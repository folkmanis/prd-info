import { Injectable } from '@angular/core';
import { Observable, merge, Subject, BehaviorSubject, EMPTY, of, observable } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay, startWith } from 'rxjs/operators';
import { PrdApiService } from 'src/app/services';

import {
  Invoice, InvoiceTable, InvoicesFilter,
  ProductTotals, JobsWithoutInvoicesTotals,
} from 'src/app/interfaces';

@Injectable()
export class InvoicesService {
  totalsFilter$ = new Subject<number[]>();

  constructor(
    private prdApi: PrdApiService,
  ) { }

  totals$: Observable<ProductTotals[]> = this.totalsFilter$.pipe(
    switchMap(f => this.prdApi.invoices.getTotals(f)),
    share(),
  );

  grandTotal$: Observable<number> = this.totals$.pipe(
    map(totals => totals.reduce((acc, curr) => acc + curr.total, 0)),
    share(),
  );

  reloadJobsWithoutInvoicesTotals$ = new Subject();
  jobsWithoutInvoicesTotals$: Observable<JobsWithoutInvoicesTotals[]> = this.reloadJobsWithoutInvoicesTotals$.pipe(
    startWith({}),
    switchMap(() => this.prdApi.jobs.jobsWithoutInvoicesTotals()),
    shareReplay(1),
  );

  createInvoice(params: { selectedJobs: number[], customerId: string; }): Observable<Invoice> {
    return this.prdApi.invoices.createInvoice(params).pipe(
      tap(() => this.reloadJobsWithoutInvoicesTotals$.next()),
    );
  }

  getInvoice(invoiceId: string): Observable<Invoice> {
    return this.prdApi.invoices.get(invoiceId);
  }

  getInvoicesHttp(params: InvoicesFilter): Observable<InvoiceTable[]> {
    return this.prdApi.invoices.get<InvoiceTable>(params);
  }

}
