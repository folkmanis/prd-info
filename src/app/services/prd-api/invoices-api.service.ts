import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import {
  Invoice,
  InvoiceCreate,
  InvoiceCreateSchema,
  InvoiceForReport,
  InvoiceForReportSchema,
  InvoicesFilter,
  InvoicesFilterSchema,
  InvoiceTable,
  InvoiceTableSchema,
  InvoiceUpdateSchema,
  pluckDeletedCount,
} from 'src/app/interfaces';
import { httpFilterSignal, validateAsync, validatorFn } from 'src/app/library';
import { cacheable, httpResponseRequest } from 'src/app/library/http';

@Service()
export class InvoicesApiService {
  readonly #path = getAppParams('apiPath') + 'invoices/';
  #http = inject(HttpClient);

  getOne(id: string): Promise<InvoiceForReport> {
    const data$ = this.#http.get(this.#path + id, cacheable());
    return validateAsync(InvoiceForReportSchema, data$);
  }

  invoicesResource(filter: Signal<InvoicesFilter | undefined>): HttpResourceRef<InvoiceTable[] | undefined> {
    const params = httpFilterSignal(InvoicesFilterSchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, params().cacheable()), {
      parse: validatorFn(InvoiceTableSchema.array()),
      equal: isEqual,
    });
  }

  createInvoice(params: InvoiceCreate): Promise<InvoiceForReport> {
    const body = InvoiceCreateSchema.encode(params);
    const data$ = this.#http.put(this.#path, body);
    return validateAsync(InvoiceForReportSchema, data$);
  }

  updateOne(id: string, data: Partial<Invoice>): Promise<InvoiceForReport> {
    const body = InvoiceUpdateSchema.encode(data);
    const data$ = this.#http.patch(this.#path + id, body);
    return validateAsync(InvoiceForReportSchema, data$);
  }

  deleteOne(id: string): Observable<number> {
    return this.#http.delete(this.#path + id).pipe(pluckDeletedCount());
  }

  getReport(data: InvoiceForReport): Observable<Blob> {
    const body = InvoiceForReportSchema.encode(data);
    return this.#http.put(this.#path + 'report', body, { responseType: 'blob' });
  }
}
