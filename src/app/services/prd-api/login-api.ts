import { ApiBase } from 'src/app/library/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User, Login, LoginResponse } from 'src/app/interfaces';

export class LoginApi extends ApiBase<User> {

    login(login: Login): Observable<User | null> {
        return this.post<LoginResponse>(login).pipe(
            map(resp => resp.error ? null : resp.data)
        );
    }

    logout(): Observable<boolean> {
        return this.post<LoginResponse>({}).pipe(
            map(resp => !resp.error)
        );
    }

}
