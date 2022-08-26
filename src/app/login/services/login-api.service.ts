import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, User } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';
import { Login } from '../login.interface';


@Injectable({
    providedIn: 'root'
})
export class LoginApiService {

    private path = this.params.apiPath + 'login/';

    constructor(
        @Inject(APP_PARAMS) private params: AppParams,
        private http: HttpClient,
        private transformer: AppClassTransformerService,
    ) { }

    login(login: Login): Observable<User> {
        return this.http.post<Record<string, any>>(this.path, login).pipe(
            this.transformer.toClass(User)
        );
    }

    logout(): Observable<unknown> {
        return this.http.delete(this.path);
    }

    getLogin(): Observable<User> {
        return this.http.get<Record<string, any>>(this.path).pipe(
            this.transformer.toClass(User),
        );
    }

    getSessionToken(): Observable<string> {
        return this.http.get<{ data: string; }>(this.path + 'session-token').pipe(
            map(value => value.data),
        );
    }

    getSessionId(): Observable<string> {
        return this.http.get<{ sessionId: string; }>(this.path + 'session-id').pipe(
            map(data => data.sessionId),
        );
    }

    patchUser({ username, ...update }: Partial<User>): Observable<User> {
        return this.http.patch<Record<string, any>>(this.path, update, new HttpOptions()).pipe(
            this.transformer.toClass(User),
        );
    }

}
