import { ApiBase, HttpOptions } from 'src/app/library/http';
import * as Pt from 'src/app/interfaces/paytraq';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_PARAMS } from 'src/app/app-params';
import { ClassTransformer } from 'class-transformer';
import { AppParams } from 'src/app/interfaces';



@Injectable({
    providedIn: 'root'
})
export class PaytraqApiService {

    readonly path = this.params.apiPath + 'paytraq/';


    constructor(
        private http: HttpClient,
        @Inject(APP_PARAMS) private params: AppParams,
        private transformer: ClassTransformer,
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