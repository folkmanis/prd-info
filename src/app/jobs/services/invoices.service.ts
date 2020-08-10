import { Injectable } from '@angular/core';
import { Observable, merge, Subject, BehaviorSubject, EMPTY, of, observable } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay } from 'rxjs/operators';
import { PrdApiService } from 'src/app/services';

import {
  Invoice, InvoiceTable, InvoicesFilter,
  ProductTotals
} from 'src/app/interfaces';

@Injectable()
export class InvoicesService {
  totalsFilter$ = new Subject<number[]>();

  constructor(
    private prdApi: PrdApiService,
  ) { }

  totals$: Observable<ProductTotals[]> = this.totalsFilter$.pipe(
    switchMap(f => this.getTotalsHttp(f)),
    share(),
  );

  grandTotal$: Observable<number> = this.totals$.pipe(
    map(totals => totals.reduce((acc, curr) => acc + curr.total, 0)),
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

  getInvoicesHttp(params: InvoicesFilter): Observable<InvoiceTable[]> {
    return this.prdApi.invoices.get<InvoiceTable>(params);
  }

}
