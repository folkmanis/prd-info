import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, pluck, switchMap } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, Login, User } from 'src/app/interfaces';
import { ApiBase } from 'src/app/library/http';


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
        return this.http.post<User>(this.path, login).pipe(
            map(resp => resp.username ? resp : null),
            catchError(() => of(null)),
        );
    }

    logout(): Observable<boolean> {
        return this.http.delete<string>(this.path).pipe(
            mapTo(true)
        );
    }

    getLogin(): Observable<User | null> {
        return this.http.get<User>(this.path).pipe(
            switchMap(user => user.username ? of(user) : of(undefined)),
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

}
