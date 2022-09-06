import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { Invoice, InvoiceForReport, InvoicesFilter, InvoiceTable, InvoiceUpdate, INVOICE_UPDATE_FIELDS } from 'src/app/interfaces';
import { PaytraqInvoice } from 'src/app/interfaces/paytraq';
import { Sale } from 'src/app/interfaces/paytraq/invoice';
import { JobQueryFilter, JobService, JobsWithoutInvoicesTotals, JobUnwindedPartial } from 'src/app/jobs';
import { PaytraqApiService } from 'src/app/services/prd-api/paytraq-api.service';
import { InvoicesApiService } from 'src/app/services/prd-api/invoices-api.service';
import { pick } from 'lodash-es';


@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  constructor(
    private jobService: JobService,
    private paytraqApi: PaytraqApiService,
    private api: InvoicesApiService,
  ) { }

  private reloadJobsWithoutInvoicesTotals$ = new Subject();
  jobsWithoutInvoicesTotals$: Observable<JobsWithoutInvoicesTotals[]> = this.reloadJobsWithoutInvoicesTotals$.pipe(
    startWith({}),
    switchMap(() => this.getJobsWithoutInvoicesTotals()),
  );

  getJobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.jobService.getJobsWithoutInvoicesTotals();
  }

  getJobsUnwinded(filter: JobQueryFilter): Observable<JobUnwindedPartial[]> {
    return this.jobService.getJobListUnwinded(filter);
  }

  reloadJobsWithoutInvoicesTotals() {
    this.reloadJobsWithoutInvoicesTotals$.next(null);
  }

  createInvoice(params: { jobIds: number[]; customerId: string; }): Observable<Invoice> {
    return this.api.createInvoice(params).pipe(
      tap(() => this.reloadJobsWithoutInvoicesTotals$.next(null)),
    );
  }

  getInvoice(invoiceId: string): Observable<Invoice> {
    return this.api.getOne(invoiceId);
  }

  getReport(data: InvoiceForReport) {
    return this.api.getReport(data);
  }

  updateInvoice(id: string, update: InvoiceUpdate): Observable<any> {
    update = pick(update, ...INVOICE_UPDATE_FIELDS);
    return this.api.updateOne(id, update).pipe(
      switchMap(resp => resp ? of(resp) : EMPTY),
    );
  }

  getInvoicesHttp(params: InvoicesFilter): Observable<InvoiceTable[]> {
    return this.api.getAll(params);
  }

  getPaytraqInvoiceRef(id: number): Observable<string> {
    return this.paytraqApi.getSale(id).pipe(
      map(data => data.sale?.header?.document?.documentRef),
    );
  }

  postPaytraqInvoice(invoice: Invoice): Observable<number> {
    const ptInvoice = new PaytraqInvoiceClass(invoice);
    return this.paytraqApi.postSale(ptInvoice).pipe(
      map(data => data.response.documentID)
    );
  }

  deleteInvoice(invoiceId: string): Observable<number> {
    return this.api.deleteOne(invoiceId);
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
