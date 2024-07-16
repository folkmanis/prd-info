import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { firstValueFrom, Observable } from 'rxjs';
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

  createInvoice(params: { jobIds: number[]; customerId: string }): Promise<Invoice> {
    return this.api.createInvoice(params);
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    return this.api.getOne(invoiceId);
  }

  async getReport(data: InvoiceForReport) {
    return this.api.getReport(data);
  }

  async updateInvoice(id: string, update: InvoiceUpdate): Promise<Invoice> {
    update = pick(update, ...INVOICE_UPDATE_FIELDS);
    return this.api.updateOne(id, update);
  }

  getInvoicesHttp(params: InvoicesFilter): Observable<InvoiceTable[]> {
    return this.api.getAll(params);
  }

  async getPaytraqInvoiceRef(id: number): Promise<string> {
    const data = await this.paytraqApi.getSale(id);
    const documentRef = data.sale?.header?.document?.documentRef;
    if (!documentRef) {
      throw new Error('Undefined');
    }
    return documentRef;
  }

  async postPaytraqInvoice(invoice: Invoice): Promise<number> {
    const ptInvoice = new PaytraqInvoiceClass(invoice);
    const data = await this.paytraqApi.postSale(ptInvoice);
    return data.response.documentID;
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
