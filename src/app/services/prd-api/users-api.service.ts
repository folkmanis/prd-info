import { HttpOptions } from 'src/app/library/http';
import { AppParams, User } from 'src/app/interfaces';
import { Observable, map, OperatorFunction } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_PARAMS } from 'src/app/app-params';
import { ClassTransformer } from 'class-transformer';

type Params = Record<string, any>;

@Injectable({
    providedIn: 'root'
})
export class UsersApiService {

    readonly path = this.params.apiPath + 'users/';

    constructor(
        private http: HttpClient,
        @Inject(APP_PARAMS) private params: AppParams,
        private transformer: ClassTransformer,
    ) { }


    getOne(name: string): Observable<User> {
        return this.http.get(this.path + name, new HttpOptions().cacheable()).pipe(
            this.toClass<Record<string, any>>()
        );
    }

    getAll(params: Params): Observable<User[]> {
        return this.http.get(this.path, new HttpOptions(params).cacheable()).pipe(
            this.toClass()
        );
    }


    updateOne(id: string | number, data: Partial<User>, params?: Params): Observable<User> {
        return this.http.patch(this.path + id, data, new HttpOptions(params)).pipe(
            this.toClass<Record<string, any>>()
        );
    }

    insertOne(data: Partial<User>, params?: Params): Observable<User> {
        return this.http.put(this.path, data, new HttpOptions(params)).pipe(
            this.toClass<Record<string, any>>(),
        );
    }

    deleteOne(id: string): Observable<number> {
        return this.http.delete<{ deletedCount: number; }>(this.path + id, new HttpOptions()).pipe(
            map(data => data.deletedCount),
        );
    }



    validatorData<K extends keyof User & string>(key: K): Observable<User[K][]> {
        return this.http.get<User[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable());
    }



    passwordUpdate(username: string, password: string): Observable<User> {
        return this.http.patch(this.path + username + '/password', { password }).pipe(
            this.toClass<Record<string, any>>()
        );
    }

    deleteSessions(username: string, sessionIds: string[]): Observable<number> {
        return this.http.delete<{ deletedCount: number; }>(this.path + username + '/session', new HttpOptions({ ids: sessionIds })).pipe(
            map(data => data.deletedCount),
        );
    }

    private toClass<T extends Record<string, any>[]>(): OperatorFunction<T, User[]>;
    private toClass<T extends Record<string, any>>(): OperatorFunction<T, User>;
    private toClass<T extends Record<string, any>>(): OperatorFunction<T, User> | OperatorFunction<T[], User[]> {
        return map(data => this.transformer.plainToInstance(User, data, { exposeDefaultValues: true }));
    }

}
