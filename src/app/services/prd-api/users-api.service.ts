import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { User } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';

type Params = Record<string, any>;

@Injectable({
    providedIn: 'root'
})
export class UsersApiService {

    readonly path = getAppParams('apiPath') + 'users/';

    constructor(
        private http: HttpClient,
        private transformer: AppClassTransformerService,
    ) { }


    getOne(name: string): Observable<User> {
        return this.http.get(this.path + name, new HttpOptions().cacheable()).pipe(
            this.transformer.toClass(User)
        );
    }

    getAll(params: Params): Observable<User[]> {
        return this.http.get(this.path, new HttpOptions(params).cacheable()).pipe(
            this.transformer.toClass(User)
        );
    }


    updateOne(id: string | number, data: Partial<User>, params?: Params): Observable<User> {
        return this.http.patch(this.path + id, data, new HttpOptions(params)).pipe(
            this.transformer.toClass(User)
        );
    }

    insertOne(data: Partial<User>, params?: Params): Observable<User> {
        return this.http.put(this.path, data, new HttpOptions(params)).pipe(
            this.transformer.toClass(User)
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
            this.transformer.toClass(User)
        );
    }

    deleteSessions(username: string, sessionIds: string[]): Observable<number> {
        return this.http.delete<{ deletedCount: number; }>(this.path + username + '/session', new HttpOptions({ ids: sessionIds })).pipe(
            map(data => data.deletedCount),
        );
    }


}
