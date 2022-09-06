import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getAppParams } from 'src/app/app-params';
import * as Pt from 'src/app/interfaces/paytraq';
import { HttpOptions } from 'src/app/library/http';



@Injectable({
    providedIn: 'root'
})
export class PaytraqApiService {

    readonly path = getAppParams('apiPath') + 'paytraq/';


    constructor(
        private http: HttpClient,
    ) { }


    getClients(query: Pt.RequestOptions): Observable<Pt.PaytraqClients> {
        return this.http.get<{ clients: Pt.PaytraqClients; }>(
            this.path + 'clients',
            new HttpOptions(query).cacheable()
        ).pipe(
            map(data => data.clients),
        );
    }

    getProducts(query: Pt.RequestOptions): Observable<Pt.PaytraqProducts> {
        return this.http.get<{ products: Pt.PaytraqProducts; }>(
            this.path + 'products',
            new HttpOptions(query).cacheable()
        ).pipe(
            map(data => data.products),
        );
    }

    getSale(id: number): Observable<Pt.PaytraqInvoice> {
        return this.http.get<Pt.PaytraqInvoice>(
            this.path + 'sale/' + id,
            new HttpOptions().cacheable()
        );
    }

    postSale(data: Pt.PaytraqInvoice): Observable<Pt.PaytraqNewInvoiceResponse> {
        return this.http.put<Pt.PaytraqNewInvoiceResponse>(
            this.path + 'sale',
            { data },
            new HttpOptions()
        );
    }

}
