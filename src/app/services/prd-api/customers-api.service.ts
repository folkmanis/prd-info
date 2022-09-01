import { AppClassTransformerService } from 'src/app/library';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, Customer, NewCustomer } from 'src/app/interfaces';
import { HttpOptions } from 'src/app/library/http/http-options';


@Injectable({
    providedIn: 'root'
})
export class CustomersApiService {

    private path = this.params.apiPath + 'customers/';

    constructor(
        private http: HttpClient,
        private transformer: AppClassTransformerService,
        @Inject(APP_PARAMS) private params: AppParams,
    ) { }

    getAll(params?: Record<string, any>): Observable<Customer[]> {
        return this.http.get<Record<string, any>[]>(this.path, new HttpOptions(params).cacheable()).pipe(
            this.transformer.toClass(Customer, { exposeDefaultValues: false }),
        );
    }

    getOne(idOrName: string, params?: Record<string, any>): Observable<Customer> {
        return this.http.get<Record<string, any>>(this.path + idOrName, new HttpOptions(params).cacheable()).pipe(
            this.transformer.toClass(Customer),
        );
    }

    updateOne(id: string, data: Partial<Customer>): Observable<Customer> {
        return this.http.patch<Record<string, any>>(
            this.path + id,
            this.transformer.instanceToPlain(data),
            new HttpOptions()
        ).pipe(
            this.transformer.toClass(Customer),
        );
    }

    insertOne(customer: NewCustomer, params?: Record<string, any>): Observable<Customer> {
        return this.http.put<Record<string, any>>(
            this.path,
            this.transformer.instanceToPlain(customer),
            new HttpOptions(params)
        ).pipe(
            this.transformer.toClass(Customer),
        );
    }

    deleteOne(id: string, params?: Record<string, any>): Observable<number> {
        return this.http.delete<{ deletedCount: number; }>(this.path + id, new HttpOptions(params)).pipe(
            map(data => data.deletedCount),
        );
    }

    validatorData<K extends keyof Customer & string>(key: K): Observable<Customer[K][]> {
        return this.http.get<Customer[K][]>(
            this.path + 'validate/' + key,
            new HttpOptions().cacheable()
        );
    }


}
