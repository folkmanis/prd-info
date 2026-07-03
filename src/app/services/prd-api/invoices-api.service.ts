import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import {
  Invoice,
  InvoiceCreate,
  InvoiceCreateSchema,
  InvoiceForReport,
  InvoiceForReportSchema,
  InvoiceTableSchema,
  InvoiceUpdateSchema,
} from 'src/app/interfaces';
import { ValidatorService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';
import { z } from 'zod';

@Service()
export class InvoicesApiService {
  readonly #path = getAppParams('apiPath') + 'invoices/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  getOne(id: string): Promise<InvoiceForReport> {
    const data$ = this.#http.get(this.#path + id, new HttpOptions().cacheable());
    return this.#validator.validateAsync(InvoiceForReportSchema, data$);
  }

  invoicesResource(params: Signal<Record<string, any>>) {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(params()).cacheable()), {
      parse: this.#validator.arrayValidatorFn(InvoiceTableSchema),
      equal: isEqual,
    });
  }

  createInvoice(params: InvoiceCreate): Promise<InvoiceForReport> {
    const body = InvoiceCreateSchema.encode(params);
    const data$ = this.#http.put(this.#path, body, new HttpOptions());
    return this.#validator.validateAsync(InvoiceForReportSchema, data$);
  }

  updateOne(id: string, data: Partial<Invoice>): Promise<InvoiceForReport> {
    const body = InvoiceUpdateSchema.encode(data);
    const data$ = this.#http.patch(this.#path + id, body, new HttpOptions());
    return this.#validator.validateAsync(InvoiceForReportSchema, data$);
  }

  async deleteOne(id: string): Promise<{ deletedCount: number }> {
    const data$ = this.#http.delete<{ deletedCount: number }>(this.#path + id, new HttpOptions());
    return this.#validator.validateAsync(z.object({ deletedCount: z.number() }), data$);
  }

  getReport(data: InvoiceForReport): Promise<Blob> {
    const body = InvoiceForReportSchema.encode(data);

    const data$ = this.#http.put(this.#path + 'report', body, { responseType: 'blob' });
    return firstValueFrom(data$);
  }
}
