import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Material } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';

@Injectable({
    providedIn: 'root'
})
export class MaterialsApiService {

    private path = getAppParams('apiPath') + 'materials/';

    constructor(
        private http: HttpClient,
        private transformer: AppClassTransformerService,
    ) { }

    getOne(id: string): Observable<Material> {
        return this.http.get<Record<string, any>>(this.path + id, new HttpOptions()).pipe(
            this.transformer.toClass(Material),
        );
    }

    getAll(params: Record<string, any> = {}): Observable<Material[]> {
        console.log(params);
        return this.http.get<Record<string, any>[]>(
            this.path,
            new HttpOptions(params)
        ).pipe(
            this.transformer.toClass(Material),
        );
    }

    updateOne(id: string, data: Partial<Material>, params?: Record<string, any>): Observable<Material> {
        return this.http.patch<Record<string, any>>(
            this.path + id,
            data,
            new HttpOptions(params)
        ).pipe(
            this.transformer.toClass(Material),
        );
    }

    insertOne(data: Partial<Material>, params?: Record<string, any>): Observable<Material> {
        return this.http.put<Record<string, any>>(
            this.path,
            data,
            new HttpOptions(params)
        ).pipe(
            this.transformer.toClass(Material),
        );
    }

    validatorData<K extends keyof Material & string>(key: K): Observable<Material[K][]> {
        return this.http.get<Material[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable());
    }



}
