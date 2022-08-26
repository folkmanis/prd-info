import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, Equipment } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';

@Injectable({
    providedIn: 'root'
})
export class EquipmentApiService {

    readonly path = this.params.apiPath + 'equipment/';

    constructor(
        private http: HttpClient,
        @Inject(APP_PARAMS) private params: AppParams,
        private transformer: AppClassTransformerService,
    ) { }

    getOne(id: string): Observable<Equipment> {
        return this.http.get(
            this.path + id,
            new HttpOptions().cacheable()
        ).pipe(
            this.transformer.toClass(Equipment),
        );
    }

    getAll(filter: Record<string, any>): Observable<Equipment[]> {
        return this.http.get<Record<string, any>[]>(
            this.path,
            new HttpOptions(filter).cacheable()
        ).pipe(
            this.transformer.toClass(Equipment)
        );
    }

    updateOne(id: string, data: Partial<Equipment>): Observable<Equipment> {
        return this.http.patch<Record<string, any>>(
            this.path + id,
            data,
            new HttpOptions()
        ).pipe(
            this.transformer.toClass(Equipment)
        );
    }

    insertOne(data: Omit<Equipment, '_id'>): Observable<Equipment> {
        return this.http.put<Record<string, any>>(
            this.path,
            data,
            new HttpOptions()
        ).pipe(
            this.transformer.toClass(Equipment),
        );
    }

    deleteOne(id: string): Observable<number> {
        return this.http.delete<{ deletedCount: number; }>(this.path + id, new HttpOptions()).pipe(
            map(data => data.deletedCount),
        );
    }

    validatorData<K extends keyof Equipment>(key: K): Observable<Equipment[K][]> {
        return this.http.get<Equipment[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable());
    }



}
