import { ApiBase, HttpOptions } from 'src/app/library/http';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';

import { Message, JobMessageActions } from 'src/app/interfaces';



const normalizeMessage: <T extends JobMessageActions = any>(message: Message<T>) => Message<T> = (message) => ({ ...message, timestamp: new Date(message.timestamp) });

export class MessagesApi extends ApiBase<Message> {

    messages<T extends JobMessageActions>(): Observable<Message<T>[]> {
        return this.http.get<Message<T>[]>(this.path, new HttpOptions()).pipe(
            map(resp => resp.map(normalizeMessage))
        );
    }

    setAllMessagesRead(): Observable<number> {
        return this.http.delete<number>(this.path + 'allRead', new HttpOptions());
    }

    deleteMessage(id: string): Observable<number> {
        return this.http.delete<0 | 1>(this.path + id, new HttpOptions());
    }



}
