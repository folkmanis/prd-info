import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, CreateProductionStage, ProductionStage, UpdateProductionStage } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';


@Injectable({
    providedIn: 'root',
})
export class ProductionStageApiService {

    private path = this.params.apiPath + 'production-stages/';


    constructor(
        private http: HttpClient,
        private transformer: AppClassTransformerService,
        @Inject(APP_PARAMS) private params: AppParams,
    ) { }

    getAll(params: Record<string, any> = {}): Observable<ProductionStage[]> {
        return this.http.get<Record<string, any>[]>(
            this.path,
            new HttpOptions(params).cacheable()
        ).pipe(
            this.transformer.toClass(ProductionStage),
        );
    }

    getOne(id: string): Observable<ProductionStage> {
        return this.http.get<Record<string, any>>(
            this.path + id,
            new HttpOptions().cacheable(),
        ).pipe(
            this.transformer.toClass(ProductionStage),
        );
    }

    updateOne({ _id, ...data }: UpdateProductionStage): Observable<ProductionStage> {
        return this.http.patch<Record<string, any>>(
            this.path + _id,
            data,
            new HttpOptions()
        ).pipe(
            this.transformer.toClass(ProductionStage),
        );
    }

    insertOne(data: CreateProductionStage): Observable<ProductionStage> {
        return this.http.put<Record<string, any>>(
            this.path,
            data,
            new HttpOptions()
        ).pipe(
            this.transformer.toClass(ProductionStage),
        );
    }

    deleteOne(id: string): Observable<number> {
        return this.http.delete<{ deletedCount: number; }>(this.path + id, new HttpOptions()).pipe(
            map(data => data.deletedCount),
        );
    }

    validatorData<K extends keyof ProductionStage & string>(key: K): Observable<ProductionStage[K][]> {
        return this.http.get<ProductionStage[K][]>(
            this.path + 'validate/' + key,
            new HttpOptions().cacheable()
        );
    }


}
