import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Invoice, INVOICE_UPDATE_FIELDS, InvoiceForReport, InvoicesFilter, InvoiceTable, InvoiceUpdate } from 'src/app/interfaces';
import { PaytraqInvoice } from 'src/app/interfaces/paytraq';
import { Sale } from 'src/app/interfaces/paytraq/invoice';
import { JobQueryFilterOptions, JobService, JobsWithoutInvoicesTotals, JobUnwindedPartial } from 'src/app/jobs';
import { InvoicesApiService } from 'src/app/services/prd-api/invoices-api.service';
import { PaytraqApiService } from 'src/app/services/prd-api/paytraq-api.service';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  constructor(
    private jobService: JobService,
    private paytraqApi: PaytraqApiService,
    private api: InvoicesApiService,
  ) {}

  getJobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.jobService.getJobsWithoutInvoicesTotals();
  }

  getJobsUnwinded(filter: Partial<JobQueryFilterOptions>): Observable<JobUnwindedPartial[]> {
    return this.jobService.getJobListUnwinded(filter);
  }

  createInvoice(params: { jobIds: number[]; customerId: string }): Observable<Invoice> {
    return this.api.createInvoice(params);
  }

  getInvoice(invoiceId: string): Observable<Invoice> {
    return this.api.getOne(invoiceId);
  }

  getReport(data: InvoiceForReport) {
    return this.api.getReport(data);
  }

  updateInvoice(id: string, update: InvoiceUpdate): Observable<Invoice> {
    update = pick(update, ...INVOICE_UPDATE_FIELDS);
    return this.api.updateOne(id, update);
  }

  getInvoicesHttp(params: InvoicesFilter): Observable<InvoiceTable[]> {
    return this.api.getAll(params);
  }

  getPaytraqInvoiceRef(id: number): Observable<string> {
    return this.paytraqApi.getSale(id).pipe(map((data) => data.sale?.header?.document?.documentRef));
  }

  postPaytraqInvoice(invoice: Invoice): Observable<number> {
    const ptInvoice = new PaytraqInvoiceClass(invoice);
    return this.paytraqApi.postSale(ptInvoice).pipe(map((data) => data.response.documentID));
  }

  async deleteInvoice(invoiceId: string): Promise<number> {
    return firstValueFrom(this.api.deleteOne(invoiceId));
  }
}

class PaytraqInvoiceClass implements PaytraqInvoice {
  sale: Sale;
  constructor(invoice: Invoice) {
    this.sale = {
      header: {
        document: {
          client: {
            clientID: invoice.customerInfo.financial.paytraqId,
          },
        },
        saleType: 'sales_invoice',
        operation: 'sell_goods',
      },
      lineItems: {
        lineItem: invoice.products.map((product) => ({
          item: {
            itemID: product.paytraqId,
          },
          qty: product.count,
          price: product.price,
        })),
      },
    };
  }
}
