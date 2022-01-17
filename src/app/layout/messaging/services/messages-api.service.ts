import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ClassTransformer } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

    setAllMessagesRead(): Observable<number> {
        return this.http.delete<number>(this.path + 'allRead', new HttpOptions());
    }

    deleteMessage(id: string): Observable<number> {
        return this.http.delete<0 | 1>(this.path + id, new HttpOptions());
    }


}
