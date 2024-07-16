import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Invoice, InvoiceForReport, InvoiceTable } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';

@Injectable({
  providedIn: 'root',
})
export class InvoicesApiService {
  readonly path = getAppParams('apiPath') + 'invoices/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  async getOne(id: string): Promise<Invoice> {
    return this.transformer.toInstanceAsync(Invoice, this.http.get(this.path + id, new HttpOptions().cacheable()));
  }

  getAll(params: Record<string, any>): Observable<InvoiceTable[]> {
    return this.http.get<InvoiceTable[]>(this.path, new HttpOptions(params).cacheable());
  }

  async updateOne(id: string, data: Partial<Invoice>): Promise<Invoice> {
    return firstValueFrom(this.http.patch(this.path + id, data, new HttpOptions()).pipe(this.transformer.toClass(Invoice)));
  }

  deleteOne(id: string): Observable<number> {
    return this.http.delete<{ deletedCount: number }>(this.path + id, new HttpOptions()).pipe(
      map((data) => {
        if (!data.deletedCount) {
          throw new Error('Not deleted');
        }
        return data.deletedCount;
      }),
    );
  }

  async createInvoice(params: { jobIds: number[]; customerId: string }): Promise<Invoice> {
    return firstValueFrom(this.http.put(this.path, params, new HttpOptions()).pipe(this.transformer.toClass(Invoice)));
  }

  async getReport(data: InvoiceForReport): Promise<Blob> {
    return firstValueFrom(this.http.put(this.path + 'report', data, { responseType: 'blob' }));
  }
}
