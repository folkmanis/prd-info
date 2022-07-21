import { AppParams, ProductionStage, CreateProductionStage, UpdateProductionStage } from 'src/app/interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { HttpOptions } from 'src/app/library/http/http-options';
import { ClassTransformer } from 'class-transformer';
import { Inject, Injectable } from '@angular/core';
import { APP_PARAMS } from 'src/app/app-params';


@Injectable({
    providedIn: 'root',
})
export class ProductionStageApiService {

    private path = this.params.apiPath + 'production-stages/';

    private toArray = () => map((data: Record<string, any>[]) => this.transformer.plainToInstance(ProductionStage, data, { exposeDefaultValues: true }));
    private toClass = () => map((data: Record<string, any>) => this.transformer.plainToInstance(ProductionStage, data, { exposeDefaultValues: true }));

    constructor(
        private http: HttpClient,
        private transformer: ClassTransformer,
        @Inject(APP_PARAMS) private params: AppParams,
    ) { }

    getAll(params: Record<string, any> = {}): Observable<ProductionStage[]> {
        console.log(params);

        return this.http.get<Record<string, any>[]>(
            this.path,
            new HttpOptions(params).cacheable()
        ).pipe(this.toArray());
    }

    getOne(id: string): Observable<ProductionStage> {
        return this.http.get<Record<string, any>>(
            this.path + id,
            new HttpOptions().cacheable(),
        ).pipe(this.toClass());
    }

    updateOne({ _id, ...data }: UpdateProductionStage): Observable<ProductionStage> {
        return this.http.patch<Record<string, any>>(
            this.path + _id,
            data,
            new HttpOptions()
        ).pipe(this.toClass());
    }

    insertOne(data: CreateProductionStage): Observable<ProductionStage> {
        return this.http.put<Record<string, any>>(
            this.path,
            data,
            new HttpOptions()
        ).pipe(this.toClass());
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
