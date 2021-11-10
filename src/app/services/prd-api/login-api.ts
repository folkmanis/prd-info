import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, pluck, switchMap } from 'rxjs/operators';
import { Login, User } from 'src/app/interfaces';
import { ApiBase } from 'src/app/library/http';


export class LoginApi extends ApiBase<User> {

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
