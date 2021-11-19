import { ApiBase, HttpOptions } from 'src/app/library/http';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';

import { Message } from 'src/app/interfaces';



const normalizeMessage: (message: Message) => Message = (message) => ({ ...message, timestamp: new Date(message.timestamp) });

export class MessagesApi extends ApiBase<Message> {

    messages(): Observable<Message[]> {
        return this.http.get<Message[]>(this.path, new HttpOptions()).pipe(
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
