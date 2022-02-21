import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ClassTransformer } from 'class-transformer';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams } from 'src/app/interfaces';
import { ApiBase, HttpOptions } from 'src/app/library/http';
import { Message } from '../interfaces';

function addDataType(message: Record<string, any>) {
    return {
        ...message,
        data: {
            ...message.data,
            _type: message.module
        }
    };
}


@Injectable({
    providedIn: 'root'
})
export class MessagesApiService extends ApiBase<Message> {

    constructor(
        @Inject(APP_PARAMS) params: AppParams,
        http: HttpClient,
        private transformer: ClassTransformer,
    ) {
        super(http, params.apiPath + 'messages/');
    }

    messages(): Observable<Message[]> {
        return this.http.get<Record<string, any>[]>(this.path, new HttpOptions()).pipe(
            map(messages => messages.map(m => addDataType(m))),
            map(resp => this.transformer.plainToInstance(Message, resp)),
        );
    }

    setOneMessageRead(id: string): Observable<Message> {
        return this.http.patch<Record<string, any>>(
            this.path + 'read/' + id, new HttpOptions()
        ).pipe(
            map(message => addDataType(message)),
            map(resp => this.transformer.plainToInstance(Message, resp)),
        );
    }

    setAllMessagesRead(): Observable<number> {
        return this.http.patch<{ modifiedCount: number; }>(this.path + 'read', new HttpOptions()).pipe(
            pluck('modifiedCount'),
        );
    }

    deleteMessage(id: string): Observable<number> {
        return this.http.delete<{ deletedCount: 0 | 1; }>(
            this.path + id,
            new HttpOptions()
        ).pipe(
            pluck('deletedCount')
        );
    }


}
