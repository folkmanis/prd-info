import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { CustomerProduct, JobProductionStage, Product, ProductPartial } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';


@Injectable({
    providedIn: 'root',
})
export class ProductsApiService {

    readonly path = getAppParams('apiPath') + 'products/';

    constructor(
        private http: HttpClient,
        private transformer: AppClassTransformerService,
    ) { }

    getAll(): Observable<ProductPartial[]> {
        return this.http.get<Record<string, any>[]>(this.path, new HttpOptions().cacheable()).pipe(
            this.transformer.toClass(Product, { exposeDefaultValues: false }),
        );
    }

    getOne(id: string): Observable<Product> {
        return this.http.get<Record<string, any>>(this.path + id, new HttpOptions().cacheable()).pipe(
            this.transformer.toClass(Product),
        );
    }

    getOneByName(name: string): Observable<Product> {
        return this.http.get<Record<string, any>>(
            this.path + 'name/' + name,
            new HttpOptions()
        ).pipe(
            this.transformer.toClass(Product),
        );
    }

    deleteOne(id: string) {
        return this.http.delete<{ deletedCount: number; }>(this.path + id, new HttpOptions()).pipe(
            map(data => data.deletedCount),
        );
    }

    updateOne(id: string, data: Partial<Product>): Observable<Product> {
        return this.http.patch<Record<string, any>>(this.path + id, data, new HttpOptions()).pipe(
            this.transformer.toClass(Product),
        );
    }

    insertOne(data: Partial<Product>): Observable<Product> {
        return this.http.put<Record<string, any>>(this.path, data, new HttpOptions()).pipe(
            this.transformer.toClass(Product),
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
