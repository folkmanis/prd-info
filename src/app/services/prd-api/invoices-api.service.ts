import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Invoice, InvoiceForReport, InvoiceTable, ProductTotals } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';

@Injectable({
  providedIn: 'root',
})
export class InvoicesApiService {
  readonly path = getAppParams('apiPath') + 'invoices/';

  constructor(
    private http: HttpClient,
    private transformer: AppClassTransformerService,
  ) {}

  getOne(id: string): Observable<Invoice> {
    return this.http.get(this.path + id, new HttpOptions().cacheable()).pipe(this.transformer.toClass(Invoice));
  }

  getAll(params: Record<string, any>): Observable<InvoiceTable[]> {
    return this.http.get<InvoiceTable[]>(this.path, new HttpOptions(params).cacheable());
  }

  updateOne(id: string, data: Partial<Invoice>): Observable<Invoice> {
    return this.http.patch(this.path + id, data, new HttpOptions()).pipe(this.transformer.toClass(Invoice));
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

  createInvoice(params: { jobIds: number[]; customerId: string }): Observable<Invoice> {
    return this.http.put(this.path, params, new HttpOptions()).pipe(this.transformer.toClass(Invoice));
  }

  getTotals(jobsId: number[]): Observable<ProductTotals[]> {
    return this.http.get<{ totals: ProductTotals[] }>(this.path + 'totals', new HttpOptions({ jobsId })).pipe(
      map((data) => data.totals),
      this.transformer.toClass(ProductTotals),
    );
  }

  getReport(data: InvoiceForReport): Observable<Blob> {
    return this.http.put(this.path + 'report', data, { responseType: 'blob' });
  }
}
