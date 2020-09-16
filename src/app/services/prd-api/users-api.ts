import { ApiBase } from 'src/app/library/http';
import { User, UsersResponse } from 'src/app/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class UsersApi extends ApiBase<User> {
    passwordUpdate(username: string, password: string): Observable<boolean> {
        return this.http.post<UsersResponse>(this.path + username + '/password', { password }).pipe(
            map(resp => resp.modifiedCount !== 0)
        );
    }
}
