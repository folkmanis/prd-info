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
                pluck('clients'),
            );
    }

    getProducts(query: Pt.RequestOptions): Observable<Pt.PaytraqProducts> {
        return this.http.get<Pt.PaytraqResponse<Pt.PaytraqProducts>>(
            this.path + 'products',
            new HttpOptions(query).cacheable()
        ).pipe(
            pluck('products'),
        );
    }

    getSale(id: number): Observable<Pt.PaytraqInvoice> {
        return this.http.get<Pt.PaytraqInvoice>(
            this.path + 'sale/' + id,
            new HttpOptions().cacheable()
        );
    }

    postSale(data: Pt.PaytraqInvoice): Observable<Pt.PaytraqNewInvoiceResponse> {
        return this.http.post<Pt.PaytraqNewInvoiceResponse>(
            this.path + 'sale',
            { data },
            new HttpOptions()
        );
    }

}
