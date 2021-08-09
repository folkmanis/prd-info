import { ApiBase, HttpOptions } from 'src/app/library/http';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';
import { User, Login, LoginResponse } from 'src/app/interfaces';
import { Message, MessageResponse, JobMessageActions } from 'src/app/interfaces';

const normalizeMessage: <T extends JobMessageActions = any>(message: Message<T>) => Message<T> = (message) => ({ ...message, timestamp: new Date(message.timestamp) });

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

    messages<T extends JobMessageActions>(fromDate?: Date): Observable<Message<T>[]> {
        const from = fromDate?.getTime();
        return this.http.get<MessageResponse<T>>(this.path + 'messages', new HttpOptions({ from })).pipe(
            map(resp => resp.data as Message<T>[]),
            map(resp => resp.map(normalizeMessage))
        );
    }

    setAllMessagesRead(): Observable<number> {
        return this.http.post<MessageResponse>(this.path + 'messages/allRead', new HttpOptions()).pipe(
            map(resp => resp.modifiedCount || 0),
        );
    }

    deleteMessage(id: string): Observable<number> {
        return this.http.delete<MessageResponse>(this.path + 'messages/' + id, new HttpOptions()).pipe(
            map(resp => resp.deletedCount || 0),
        );
    }

}
