import { Injectable } from '@angular/core';
import { pick } from 'prd-cdk';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { map, pluck, startWith, switchMap, tap } from 'rxjs/operators';
import {
  Invoice, InvoicesFilter, InvoiceTable,
  InvoiceUpdate, INVOICE_UPDATE_FIELDS, JobPartial, JobQueryFilter, JobsWithoutInvoicesTotals, InvoiceForReport, JobUnwindedPartial
} from 'src/app/interfaces';
import { PaytraqInvoice } from 'src/app/interfaces/paytraq';
import { Sale } from 'src/app/interfaces/paytraq/invoice';
import { PrdApiService } from 'src/app/services';

@Injectable({ providedIn: 'any' })
export class InvoicesService {

  constructor(
    private prdApi: PrdApiService,
  ) { }

  private reloadJobsWithoutInvoicesTotals$ = new Subject();
  jobsWithoutInvoicesTotals$: Observable<JobsWithoutInvoicesTotals[]> = this.reloadJobsWithoutInvoicesTotals$.pipe(
    startWith({}),
    switchMap(() => this.getJobsWithoutInvoicesTotals()),
  );

  getJobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.prdApi.jobs.jobsWithoutInvoicesTotals();
  }

  getJobs(filter: JobQueryFilter): Observable<JobPartial[]> {
    filter.unwindProducts = 0;
    return this.prdApi.jobs.get(filter);
  }

  getJobsUnwinded(filter: JobQueryFilter): Observable<JobUnwindedPartial[]> {
    filter.unwindProducts = 1;
    return this.prdApi.jobs.get(filter);
  }

  reloadJobsWithoutInvoicesTotals() {
    this.reloadJobsWithoutInvoicesTotals$.next();
  }

  createInvoice(params: { selectedJobs: number[]; customerId: string; }): Observable<Invoice> {
    return this.prdApi.invoices.createInvoice(params).pipe(
      tap(() => this.reloadJobsWithoutInvoicesTotals$.next()),
    );
  }

  getInvoice(invoiceId: string): Observable<Invoice> {
    return this.prdApi.invoices.get(invoiceId);
  }

  getReport(data: InvoiceForReport) {
    return this.prdApi.invoices.getReport(data);
  }

  updateInvoice(id: string, update: InvoiceUpdate): Observable<any> {
    update = pick(update, ...INVOICE_UPDATE_FIELDS);
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

  deleteInvoice(invoiceId: string): Observable<number> {
    return this.prdApi.invoices.deleteOne(invoiceId);
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
