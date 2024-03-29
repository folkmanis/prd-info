import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { User } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';
import { Login } from '../login.interface';
import { DEMO_MODE } from 'src/app/services/app-mode.provider';


@Injectable({
    providedIn: 'root'
})
export class LoginApiService {

    private path = getAppParams('apiPath') + 'login/';

    private isDemo = inject(DEMO_MODE);

    constructor(
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
        return this.http
            .get<Record<string, any>>(
                this.path,
            ).pipe(
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
        this.checkDemoMode();
        return this.http.patch<Record<string, any>>(this.path, update, new HttpOptions()).pipe(
            this.transformer.toClass(User),
        );
    }

    private checkDemoMode(): void | never {
        if (this.isDemo) {
            throw new Error('restricted in demo mode');
        }
    }

}
