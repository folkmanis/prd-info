import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { HttpOptions } from 'src/app/library/http/http-options';
import { AppHttpResponseBase } from 'src/app/library/http/app-http-response-base';

export abstract class ApiBase<T> {
    constructor(
        protected http: HttpClient,
        protected path: string,
    ) { }

    get<P = Partial<T>>(params?: { [key: string]: any; }): Observable<P[]>;
    get<P = Partial<T>>(id: string | number, params?: { [key: string]: any; }): Observable<T>;
    get<P = Partial<T>>(
        idOrParams?: string | number | { [key: string]: any; },
        params?: { [key: string]: any; }
    ): Observable<P[]> | Observable<T> {

        if (idOrParams && idOrParams instanceof Object) {
            return this.http.get<AppHttpResponseBase<T>>(this.path, new HttpOptions(idOrParams).cacheable()).pipe(
                map(resp => resp.data as P[])
            );
        }
        if (idOrParams) {
            return this.http.get<AppHttpResponseBase<T>>(this.path + idOrParams, new HttpOptions(params).cacheable()).pipe(
                map(resp => resp.data as T)
            );
        }
        return this.http.get<AppHttpResponseBase<T>>(this.path, new HttpOptions().cacheable()).pipe(
            map(resp => resp.data as P[])
        );
    }

    deleteOne(id: string | number): Observable<number> {
        return this.http.delete<AppHttpResponseBase<T>>(this.path + id, new HttpOptions()).pipe(
            map(resp => resp.deletedCount || 0),
        );
    }

    update(data: Partial<T[]>): Observable<number> {
        return this.http.post<AppHttpResponseBase<T>>(this.path, data, new HttpOptions()).pipe(
            pluck('modifiedCount'),
        );
    }

    updateOne(id: string | number, data: Partial<T>): Observable<boolean> {
        return this.http.post<AppHttpResponseBase<T>>(this.path + id, data, new HttpOptions()).pipe(
            pluck('modifiedCount'),
            map(count => !!count)
        );
    }

    insertOne(data: Partial<T>): Observable<string | number | null> {
        return this.http.put<AppHttpResponseBase<T>>(this.path, data, new HttpOptions()).pipe(
            map(resp => resp.error ? null : resp.insertedId),
        );
    }

    validatorData<K extends keyof T>(key: K): Observable<T[keyof T][]> {
        return this.http.get<AppHttpResponseBase<T>>(this.path + 'validate/' + key, new HttpOptions().cacheable()).pipe(
            map((values) => values.validatorData),
        );
    }

    protected post<U>(body: any): Observable<U>;
    protected post<U>(path: string, body: any): Observable<U>;
    protected post<U>(pathOrBody: string | any, body?: any): Observable<U> {
        let path = this.path;
        if (typeof pathOrBody === 'string') {
            path = path + pathOrBody;
        } else {
            body = pathOrBody;
        }
        return this.http.post<U>(path, body, new HttpOptions());
    }

}
