import { HttpResourceRef } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InvoiceCreate, InvoiceForReport, InvoicesFilter, InvoiceUpdate } from 'src/app/interfaces';
import { PaytraqInvoice, Sale } from 'src/app/interfaces/paytraq';
import { JobFilter, JobService, JobsWithoutInvoicesTotals, JobUnwindedPartial } from 'src/app/jobs';
import { FilterInput, notNullOrThrow, numberOrDefaultZero, numberOrThrow, toFilterSignal } from 'src/app/library';
import { InvoicesApiService } from 'src/app/services/prd-api/invoices-api.service';
import { PaytraqApiService } from 'src/app/services/prd-api/paytraq-api.service';

const WAREHOUSE_ID = 213;
const LOADING_AREA_ID = 301;

@Service()
export class InvoicesService {
  #api = inject(InvoicesApiService);
  #paytraqApi = inject(PaytraqApiService);
  #jobService = inject(JobService);

  getJobsWithoutInvoicesTotals(): Observable<JobsWithoutInvoicesTotals[]> {
    return this.#jobService.getJobsWithoutInvoicesTotals().pipe(map((totals) => totals.filter((t) => t.totals > 0)));
  }

  jobsUnwindedResource(filter: FilterInput<JobFilter>): HttpResourceRef<JobUnwindedPartial[] | undefined> {
    return this.#jobService.getJobsUnwindedResource(filter);
  }

  createInvoice(params: InvoiceCreate): Promise<InvoiceForReport> {
    return this.#api.createInvoice(params);
  }

  async getInvoice(invoiceId: string): Promise<InvoiceForReport> {
    return this.#api.getOne(invoiceId);
  }

  async getReport(data: InvoiceForReport) {
    return this.#api.getReport(data);
  }

  async updateInvoice(id: string, update: InvoiceUpdate): Promise<InvoiceForReport> {
    return this.#api.updateOne(id, update);
  }

  getInvoicesResource(params?: FilterInput<InvoicesFilter>) {
    return this.#api.invoicesResource(toFilterSignal(params));
  }

  async saveToPaytraq(invoice: InvoiceForReport): Promise<string> {
    const ptInvoice = invoiceToPaytraqInvoice(invoice);
    const {
      response: { documentID: paytraqId },
    } = await this.#paytraqApi.postSale(ptInvoice);

    const data = await this.#paytraqApi.getSale(paytraqId);
    const documentRef = notNullOrThrow(data.sale?.header?.document?.documentRef);

    await this.updateInvoice(invoice.invoiceId, {
      paytraq: { paytraqId, documentRef },
    });
    return documentRef;
  }

  async deleteInvoice(invoiceId: string): Promise<number> {
    const { deletedCount } = await this.#api.deleteOne(invoiceId);
    return deletedCount;
  }
}

function invoiceToPaytraqInvoice(invoice: InvoiceForReport): PaytraqInvoice {
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
        itemDescription: product.comment,
      })),
    },
  };
  return { sale };
}
