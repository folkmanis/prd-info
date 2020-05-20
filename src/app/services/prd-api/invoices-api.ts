import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Invoice, InvoiceResponse, ProductTotals } from 'src/app/interfaces';
import { ApiBase, HttpOptions } from 'src/app/library';

export class InvoicesApi extends ApiBase<Invoice> {

    createInvoice(params: { selectedJobs: number[], customerId: string; }): Observable<Invoice> {
        return this.http.post<InvoiceResponse>(this.path, params, new HttpOptions()).pipe(
            map(resp => resp.data as Invoice)
        );
    }

    getTotals(jobsId: number[]): Observable<ProductTotals[]> {
        return this.http.get<InvoiceResponse>(this.path + 'totals', new HttpOptions({ jobsId })).pipe(
            map(resp => resp.totals),
        );
    }

}
