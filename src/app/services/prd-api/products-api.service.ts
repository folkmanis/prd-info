import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppParams, ProductPartial } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';
import { Observable, of } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { CustomerProduct, JobProductionStage, Product } from 'src/app/interfaces';
import { HttpOptions } from 'src/app/library/http';
import { ClassTransformer } from 'class-transformer';


@Injectable({
    providedIn: 'root',
})
export class ProductsApiService {

    readonly path = this.params.apiPath + 'products/';

    private toArray = () => map((data: Record<string, any>[]) => this.transformer.plainToInstance(Product, data, { exposeDefaultValues: true }));
    private toClass = () => map((data: Record<string, any>) => this.transformer.plainToInstance(Product, data, { exposeDefaultValues: true }));

    constructor(
        private http: HttpClient,
        private transformer: ClassTransformer,
        @Inject(APP_PARAMS) private params: AppParams,
    ) { }

    getAll(): Observable<ProductPartial[]> {
        return this.http.get<Record<string, any>[]>(this.path, new HttpOptions().cacheable()).pipe(
            this.toArray()
        );
    }

    getOne(id: string): Observable<Product> {
        return this.http.get<Record<string, any>>(this.path + id, new HttpOptions().cacheable()).pipe(
            this.toClass(),
        );
    }

    deleteOne(id: string) {
        return this.http.delete<{ deletedCount: number; }>(this.path + id, new HttpOptions()).pipe(
            pluck('deletedCount'),
        );
    }

    updateOne(id: string, data: Partial<Product>): Observable<Product> {
        return this.http.patch<Record<string, any>>(this.path + id, data, new HttpOptions()).pipe(
            this.toClass(),
        );
    }

    insertOne(data: Partial<Product>): Observable<Product> {
        return this.http.put<Record<string, any>>(this.path, data, new HttpOptions()).pipe(
            this.toClass(),
        );
    }

    validatorData<K extends keyof Product & string>(key: K): Observable<Product[K][]> {
        return this.http.get<Product[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable());
    }

    productsCustomer(customer: string): Observable<CustomerProduct[]> {
        return this.http.get<Record<string, any>[]>(
            this.path + 'prices/customer/' + customer,
            new HttpOptions().cacheable(),
        ).pipe(
            map(data => this.transformer.plainToInstance(CustomerProduct, data, { exposeDefaultValues: true }))
        );

    }

    productionStages(productName: string): Observable<JobProductionStage[]> {
        return this.http.get<Record<string, any>[]>(
            this.path + productName + '/productionStages',
            new HttpOptions().cacheable(),
        ).pipe(
            map(data => this.transformer.plainToInstance(JobProductionStage, data, { exposeDefaultValues: true }))
        );
    }

}
