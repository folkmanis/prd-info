import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, pluck, switchMap } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, User } from 'src/app/interfaces';
import { ApiBase, HttpOptions } from 'src/app/library/http';
import { Login } from '../login.interface';


@Injectable({
    providedIn: 'root'
})
export class LoginApiService extends ApiBase<User> {

    constructor(
        @Inject(APP_PARAMS) params: AppParams,
        http: HttpClient,
    ) {
        super(http, params.apiPath + 'login/');
    }

    login(login: Login): Observable<User | null> {
        return this.http.post<User>(this.path, login);
    }

    logout(): Observable<boolean> {
        return this.http.delete<string>(this.path).pipe(
            map(() => true)
        );
    }

    getLogin(): Observable<User | null> {
        return this.http.get<User>(this.path).pipe(
            catchError(() => of(null)),
        );
    }

    getSessionToken(): Observable<string> {
        return this.http.get<{ data: string; }>(this.path + 'session-token').pipe(
            pluck('data'),
        );
    }

    getSessionId(): Observable<string> {
        return this.http.get<{ sessionId: string; }>(this.path + 'session-id').pipe(
            pluck('sessionId'),
        );
    }

    patchUser({ username, ...update }: Partial<User>): Observable<User> {
        return this.http.patch<User>(this.path, update, new HttpOptions());
    }

}
