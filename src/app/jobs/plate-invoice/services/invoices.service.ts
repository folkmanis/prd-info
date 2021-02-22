import { Injectable } from '@angular/core';
import { Observable, merge, Subject, BehaviorSubject, EMPTY, of, observable } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay, startWith } from 'rxjs/operators';
import { PrdApiService } from 'src/app/services';

import {
  Invoice, InvoiceTable, InvoicesFilter,
  ProductTotals, JobsWithoutInvoicesTotals, InvoiceUpdate, INVOICE_UPDATE_FIELDS,
} from 'src/app/interfaces';
import { PaytraqInvoice } from 'src/app/interfaces/paytraq';
import { Sale } from 'src/app/interfaces/paytraq/invoice';

@Injectable({ providedIn: 'any' })
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

  createInvoice(params: { selectedJobs: number[]; customerId: string }): Observable<Invoice> {
    return this.prdApi.invoices.createInvoice(params).pipe(
      tap(() => this.reloadJobsWithoutInvoicesTotals$.next()),
    );
  }

  getInvoice(invoiceId: string): Observable<Invoice> {
    return this.prdApi.invoices.get(invoiceId);
  }

  updateInvoice(id: string, update: InvoiceUpdate): Observable<any> {
    update = pick(update, INVOICE_UPDATE_FIELDS);
    return this.prdApi.invoices.updateOne(id, update).pipe(
      switchMap(resp => resp ? of(resp) : EMPTY),
    );
  }

  getInvoicesHttp(params: InvoicesFilter): Observable<InvoiceTable[]> {
    return this.prdApi.invoices.get<InvoiceTable>(params);
  }

  getPaytraqInvoiceRef(id: number): Observable<string> {
    return this.prdApi.paytraq.getSale(id).pipe(
      pluck('sale', 'header', 'document', 'documentRef'),
    );
  }

  postPaytraqInvoice(invoice: Invoice): Observable<number> {
    const ptInvoice = new PaytraqInvoiceClass(invoice);
    return this.prdApi.paytraq.postSale(ptInvoice).pipe(
      pluck('response', 'documentID')
    );
  }

}

class PaytraqInvoiceClass implements PaytraqInvoice {
  sale: Sale;
  constructor(invoice: Invoice) {
    this.sale = {
      header: {
        document: {
          client: {
            clientID: invoice.customerInfo.financial.paytraqId
          }
        },
        saleType: 'sales_invoice',
        operation: 'sell_goods'
      },
      lineItems: {
        lineItem: invoice.products.map(product => ({
          item: {
            itemID: product.paytraqId
          },
          qty: product.count,
          price: product.price,
        }))
      }
    };
  }
}

function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  return Object.assign(
    {},
    ...Object.entries(obj)
      .filter(([k]) => keys.filter(key => key === k))
      .map(([k, v]) => ({ [k]: v }))
  );
}
