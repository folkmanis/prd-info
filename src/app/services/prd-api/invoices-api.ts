import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Invoice, InvoiceForReport, ProductTotals } from 'src/app/interfaces';
import { ApiBase, HttpOptions } from 'src/app/library/http';

export class InvoicesApi extends ApiBase<Invoice> {

    createInvoice(params: { jobIds: number[]; customerId: string; }): Observable<Invoice> {
        return this.http.put<Invoice>(this.path, params, new HttpOptions());
    }

    getTotals(jobsId: number[]): Observable<ProductTotals[]> {
        return this.http.get<{ totals: ProductTotals[]; }>(this.path + 'totals', new HttpOptions({ jobsId })).pipe(
            pluck('totals'),
        );
    }

    getReport(data: InvoiceForReport): Observable<Blob> {
        return this.http.put(this.path + 'report', data, { responseType: 'blob' });
    }

}
