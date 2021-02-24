import { ApiBase, HttpOptions } from 'src/app/library/http';
import * as Pt from 'src/app/interfaces/paytraq';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';



export class PaytraqApi extends ApiBase<Pt.PaytraqData> {

    getClients(query: Pt.RequestOptions): Observable<Pt.PaytraqClients> {
        return this.http.get<Pt.PaytraqResponse<Pt.PaytraqClients>>(
            this.path + 'clients',
            new HttpOptions(query).cacheable()
        )
            .pipe(
                pluck('data', 'clients'),
            );
    }

    getProducts(query: Pt.RequestOptions): Observable<Pt.PaytraqProducts> {
        return this.http.get<Pt.PaytraqResponse<Pt.PaytraqProducts>>(
            this.path + 'products',
            new HttpOptions(query).cacheable()
        ).pipe(
            pluck('data', 'products'),
        );
    }

    getSale(id: number): Observable<Pt.PaytraqInvoice> {
        return this.http.get<Pt.PaytraqResponse<Pt.PaytraqInvoice>>(
            this.path + 'sale/' + id,
            new HttpOptions().cacheable()
        ).pipe(
            pluck('data')
        );
    }

    postSale(data: Pt.PaytraqInvoice): Observable<Pt.PaytraqNewInvoiceResponse> {
        return this.http.post<Pt.PaytraqResponse<Pt.PaytraqNewInvoiceResponse>>(
            this.path + 'sale',
            { data },
            new HttpOptions()
        ).pipe(
            pluck('data')
        );
    }

}
