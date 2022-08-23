import { AppParams, Material } from 'src/app/interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, map, OperatorFunction } from 'rxjs';
import { HttpOptions } from 'src/app/library/http/http-options';
import { Injectable, Inject } from '@angular/core';
import { APP_PARAMS } from 'src/app/app-params';
import { ClassTransformer } from 'class-transformer';

@Injectable({
    providedIn: 'root'
})
export class MaterialsApiService {

    private path = this.params.apiPath + 'materials/';

    constructor(
        private http: HttpClient,
        @Inject(APP_PARAMS) private params: AppParams,
        private transformer: ClassTransformer,
    ) { }

    getOne(id: string): Observable<Material> {
        return this.http.get(this.path + id, new HttpOptions()).pipe(
            this.toClass<Record<string, any>>(),
        );
    }

    getAll(params: Record<string, any> = {}): Observable<Material[]> {
        return this.http.get(
            this.path,
            new HttpOptions(params)
        ).pipe(
            this.toClass(),
        );
    }

    updateOne(id: string, data: Partial<Material>, params?: Record<string, any>): Observable<Material> {
        return this.http.patch(
            this.path + id,
            data,
            new HttpOptions(params)
        ).pipe(
            this.toClass<Record<string, any>>(),
        );
    }

    insertOne(data: Partial<Material>, params?: Record<string, any>): Observable<Material> {
        return this.http.put(
            this.path,
            data,
            new HttpOptions(params)
        ).pipe(
            this.toClass<Record<string, any>>(),
        );
    }

    validatorData<K extends keyof Material & string>(key: K): Observable<Material[K][]> {
        return this.http.get<Material[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable());
    }


    private toClass<T extends Record<string, any>[]>(): OperatorFunction<T, Material[]>;
    private toClass<T extends Record<string, any>>(): OperatorFunction<T, Material>;
    private toClass<T extends Record<string, any>>(): OperatorFunction<T, Material> | OperatorFunction<T[], Material[]> {
        return map(data => this.transformer.plainToInstance(Material, data, { exposeDefaultValues: true }));
    }


}
