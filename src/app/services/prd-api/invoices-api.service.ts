import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Invoice, InvoiceForReport, InvoiceSchema, InvoiceTableSchema } from 'src/app/interfaces';
import { ValidatorService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';

@Injectable({
  providedIn: 'root',
})
export class InvoicesApiService {
  readonly #path = getAppParams('apiPath') + 'invoices/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  getOne(id: string): Promise<Invoice> {
    const data$ = this.#http.get(this.#path + id, new HttpOptions().cacheable());
    return this.#validator.validateAsync(InvoiceSchema, data$);
  }

  invoicesResource(params: Signal<Record<string, any>>) {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(params()).cacheable()), {
      parse: this.#validator.arrayValidatorFn(InvoiceTableSchema),
      equal: isEqual,
    });
  }

  updateOne(id: string, data: Partial<Invoice>): Promise<Invoice> {
    const data$ = this.#http.patch(this.#path + id, data, new HttpOptions());
    return this.#validator.validateAsync(InvoiceSchema, data$);
  }

  async deleteOne(id: string): Promise<number> {
    const data$ = this.#http.delete<{ deletedCount: number }>(this.#path + id, new HttpOptions());
    const { deletedCount } = await firstValueFrom(data$);
    if (!deletedCount) {
      throw new Error('Not deleted');
    }
    return deletedCount;
  }

  createInvoice(params: { jobIds: number[]; customerId: string }): Promise<Invoice> {
    const data$ = this.#http.put(this.#path, params, new HttpOptions());
    return this.#validator.validateAsync(InvoiceSchema, data$);
  }

  getReport(data: InvoiceForReport): Promise<Blob> {
    const data$ = this.#http.put(this.#path + 'report', data, { responseType: 'blob' });
    return firstValueFrom(data$);
  }
}
