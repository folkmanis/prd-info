import { HttpResourceRef } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { Invoice, INVOICE_UPDATE_FIELDS, InvoiceForReport, InvoicesFilter, InvoiceUpdate } from 'src/app/interfaces';
import { PaytraqInvoice, Sale } from 'src/app/interfaces/paytraq';
import { JobFilter, JobService, JobsWithoutInvoicesTotals, JobUnwindedPartial } from 'src/app/jobs';
import { FilterInput, numberOrDefaultZero, numberOrThrow, toFilterSignal } from 'src/app/library';
import { InvoicesApiService } from 'src/app/services/prd-api/invoices-api.service';
import { PaytraqApiService } from 'src/app/services/prd-api/paytraq-api.service';

const WAREHOUSE_ID = 213;
const LOADING_AREA_ID = 301;

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  #api = inject(InvoicesApiService);
  #paytraqApi = inject(PaytraqApiService);
  #jobService = inject(JobService);

  getJobsWithoutInvoicesTotals(): Promise<JobsWithoutInvoicesTotals[]> {
    return this.#jobService.getJobsWithoutInvoicesTotals();
  }

  jobsUnwindedResource(filter: FilterInput<JobFilter>): HttpResourceRef<JobUnwindedPartial[] | undefined> {
    return this.#jobService.getJobsUnwindedResource(filter);
  }

  createInvoice(params: { jobIds: number[]; customerId: string }): Promise<Invoice> {
    return this.#api.createInvoice(params);
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    return this.#api.getOne(invoiceId);
  }

  async getReport(data: InvoiceForReport) {
    return this.#api.getReport(data);
  }

  async updateInvoice(id: string, update: InvoiceUpdate): Promise<Invoice> {
    update = pick(update, ...INVOICE_UPDATE_FIELDS);
    return this.#api.updateOne(id, update);
  }

  getInvoicesResource(params?: FilterInput<InvoicesFilter>) {
    return this.#api.invoicesResource(toFilterSignal(params));
  }

  async getPaytraqInvoiceRef(id: number): Promise<string> {
    const data = await this.#paytraqApi.getSale(id);
    const documentRef = data.sale?.header?.document?.documentRef;
    if (!documentRef) {
      throw new Error('Undefined');
    }
    return documentRef;
  }

  async postPaytraqInvoice(invoice: Invoice): Promise<number> {
    const ptInvoice = invoiceToPaytraqInvoice(invoice);
    const data = await this.#paytraqApi.postSale(ptInvoice);
    return data.response.documentID;
  }

  async deleteInvoice(invoiceId: string): Promise<number> {
    return this.#api.deleteOne(invoiceId);
  }
}

function invoiceToPaytraqInvoice(invoice: Invoice): PaytraqInvoice {
  const clientID = numberOrThrow(invoice.customerInfo?.financial?.paytraqId);
  const sale: Sale = {
    header: {
      document: {
        client: {
          clientID,
        },
      },
      saleType: 'sales_invoice',
      operation: 'sell_goods',
      shippingData: {
        shippingType: 1,
        warehouse: {
          warehouseID: WAREHOUSE_ID,
        },
        loadingArea: {
          loadingAreaID: LOADING_AREA_ID,
        },
      },
    },
    lineItems: {
      lineItem: invoice.products.map((product) => ({
        item: {
          itemID: numberOrThrow(product.paytraqId),
        },
        qty: product.count,
        price: numberOrDefaultZero(product.price),
      })),
    },
  };
  return { sale };
}
