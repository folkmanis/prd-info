import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { HttpOptions } from 'src/app/library/http/http-options';

interface Params {
    [key: string]: any;
}

export abstract class ApiBase<T> {
    constructor(
        protected http: HttpClient,
        protected path: string,
    ) { }

    get<P = Partial<T>>(params?: Params): Observable<P[]>;
    get(id: string | number, params?: Params): Observable<T>;
    get<P = Partial<T>>(
        idOrParams?: string | number | Params,
        params?: Params
    ): Observable<P[]> | Observable<T> {

        if (idOrParams && idOrParams instanceof Object) {
            return this.http.get<P[]>(this.path, new HttpOptions(idOrParams).cacheable());
        }
        if (idOrParams) {
            return this.http.get<T>(this.path + idOrParams, new HttpOptions(params).cacheable());
        }
        return this.http.get<P[]>(this.path, new HttpOptions().cacheable());
    }

    deleteOne(id: string | number): Observable<number> {
        return this.http.delete<{ deletedCount: number; }>(this.path + id, new HttpOptions()).pipe(
            pluck('deletedCount'),
        );
    }

    updateMany(data: Partial<T>[], params?: Params): Observable<number> {
        return this.http.patch<number>(this.path, data, new HttpOptions(params));
    }

    updateOne(id: string | number, data: Partial<T>, params?: Params): Observable<T> {
        return this.http.patch<T>(this.path + id, data, new HttpOptions(params));
    }

    insertOne(data: Partial<T>, params?: Params): Observable<T> {
        return this.http.put<T>(this.path, data, new HttpOptions(params));
    }

    validatorData<K extends keyof T & string>(key: K): Observable<T[K][]> {
        return this.http.get<T[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable());
    }

    protected patch<U>(body: any): Observable<U>;
    protected patch<U>(path: string, body: any): Observable<U>;
    protected patch<U>(pathOrBody: string | any, body?: any): Observable<U> {
        let path = this.path;
        if (typeof pathOrBody === 'string') {
            path = path + pathOrBody;
        } else {
            body = pathOrBody;
        }
        return this.http.patch<U>(path, body, new HttpOptions());
    }

}
