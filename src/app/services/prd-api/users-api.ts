import { ApiBase, HttpOptions } from 'src/app/library/http';
import { User } from 'src/app/interfaces';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

export class UsersApi extends ApiBase<User> {
    passwordUpdate(username: string, password: string): Observable<User> {
        return this.http.patch<User>(this.path + username + '/password', { password });
    }

    deleteSessions(username: string, sessionIds: string[]): Observable<number> {
        return this.http.delete<{ deletedCount: number; }>(this.path + username + '/session', new HttpOptions({ ids: sessionIds })).pipe(
            pluck('deletedCount'),
        );
    }
}
