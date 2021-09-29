import { ApiBase, HttpOptions } from 'src/app/library/http';
import { Observable, of } from 'rxjs';
import { catchError, map, mapTo, pluck, switchMap, switchMapTo, tap } from 'rxjs/operators';
import { User, Login, LoginResponse } from 'src/app/interfaces';
import { log } from 'prd-cdk';


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

}
